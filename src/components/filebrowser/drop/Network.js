/*
 * @LastEditors: zhanghengxin ezreal.zhang@icewhale.org
 * @LastEditTime: 2023/4/24 上午11:20
 * @FilePath: /CasaOS-UI/src/components/filebrowser/drop/Network.js
 * @Description:
 *
 * Copyright (c) 2023 by IceWhale, All Rights Reserved.

 */

window.URL = window.URL || window.webkitURL;
window.isRtcSupported = !!(window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection);

export class ServerConnection {

	constructor(url, bus) {
		this._connect(url);
		this.selfId = "";
		this.bus = bus;
		this.bus.$on("beforeunload", () => this._disconnect());
		this.bus.$on("pagehide", () => this._disconnect());
		document.addEventListener('visibilitychange', () => this._onVisibilityChange());
	}

	_connect(url) {
		if (!url) return;
		clearTimeout(this._reconnectTimer);
		if (this._isConnected() || this._isConnecting()) return;
		const ws = new WebSocket(url);
		ws.binaryType = 'arraybuffer';
		ws.onopen = () => console.log('WS: server connected');
		ws.onmessage = e => this._onMessage(e.data);
		ws.onclose = () => this._onDisconnect();
		ws.onerror = e => console.error(e);
		this._socket = ws;
	}

	_onMessage(msg) {
		msg = JSON.parse(msg);
		console.log('WS:', msg);
		switch (msg.type) {
			case 'peers':
				this.bus.$emit(msg.type, msg.peers);
				break;
			case 'peer-joined':
				this.bus.$emit(msg.type, msg.peer);
				break;
			case 'peer-left':
				this.bus.$emit(msg.type, msg.peerId);
				break;
			case 'signal':
				this.bus.$emit(msg.type, msg);
				break;
			case 'ping':
				this.send({type: 'pong'});
				break;
			case 'display-name':
				this.selfId = msg.message.id;
				this.bus.$emit(msg.type, msg);
				break;
			default:
				console.error('WS: unkown message type', msg);
		}
	}

	deleteSelf(peers) {

		peers.forEach(element => {
			// element.rtcSupported = true
		});
		return peers;
	}

	send(message) {
		if (!this._isConnected()) return;
		this._socket.send(JSON.stringify(message));
	}

	destroy() {
		this.send({type: 'disconnect'});
		this._socket.onclose = null;
		this._socket.close();
		this.bus.$emit('close-connection', 'Disconnected');
	}

	_endpoint() {
		// hack to detect if deployment or development environment
		const protocol = location.protocol.startsWith('https') ? 'wss' : 'ws';
		const webrtc = window.isRtcSupported ? '/webrtc' : '/fallback';
		const url = protocol + '://localhost:3000' + location.pathname + 'server' + webrtc;
		return url;
	}

	_disconnect() {
		this.send({type: 'disconnect'});
		this._socket.onclose = null;
		this._socket.close();
		this.bus.$emit('close-connection', 'Disconnected');
	}

	_onDisconnect() {
		// console.log('WS: server disconnected');
		this.bus.$emit('notify-user', 'Connection lost. Retry in 5 seconds...');
		clearTimeout(this._reconnectTimer);
		this._reconnectTimer = setTimeout(() => this._connect(), 5000);
	}

	_onVisibilityChange() {
		if (document.hidden) return;
		this._connect();
	}

	_isConnected() {
		return this._socket && this._socket.readyState === this._socket.OPEN;
	}

	_isConnecting() {
		return this._socket && this._socket.readyState === this._socket.CONNECTING;
	}
}

export class Peer {

	constructor(serverConnection, peerId, bus) {
		this._server = serverConnection;
		this._peerId = peerId;
		this._filesQueue = [];
		this._files = [];
		this._busy = false;
		this.bus = bus;
	}

	sendJSON(message) {
		this._send(JSON.stringify(message));
	}

	sendFiles(files) {
		this._files = files;
		for (let i = 0; i < files.length; i++) {
			this._filesQueue.push(files[i]);
		}
		if (this._busy) return;
		this._dequeueFile();
	}


	_dequeueFile() {
		if (!this._filesQueue.length) return;
		this._busy = true;
		const file = this._filesQueue.shift();
		this._sendFile(file);
	}

	_sendFile(file) {
		this.sendJSON({
			type: 'header',
			name: file.name,
			mime: file.type,
			size: file.size,
			from: file.from
		});
		this._chunker = new FileChunker(file,
			chunk => this._send(chunk),
			offset => this._onPartitionEnd(offset));
		this._chunker.nextPartition();
	}

	_onPartitionEnd(offset) {
		this.sendJSON({type: 'partition', offset: offset});
	}

	_onReceivedPartitionEnd(offset) {
		this.sendJSON({type: 'partition-received', offset: offset});
	}

	_sendNextPartition() {
		if (!this._chunker || this._chunker.isFileEnd()) return;
		this._chunker.nextPartition();
	}

	_sendProgress(progress) {
		this.sendJSON({type: 'progress', progress: progress});
	}

	_onMessage(message) {
		if (typeof message !== 'string') {
			this._onChunkReceived(message);
			return;
		}
		message = JSON.parse(message);
		// console.log('RTC:', message);
		switch (message.type) {
			case 'header':
				this._onFileHeader(message);
				break;
			case 'partition':
				this._onReceivedPartitionEnd(message);
				break;
			case 'partition-received':
				this._sendNextPartition();
				break;
			case 'progress':
				this._onDownloadProgress(message.progress);
				break;
			case 'transfer-complete':
				this._onTransferCompleted();
				break;
			case 'text':
				this._onTextReceived(message);
				break;
		}
	}

	_onFileHeader(header) {
		this._lastProgress = 0;
		this._digester = new FileDigester({
			name: header.name,
			mime: header.mime,
			size: header.size,
		}, file => this._onFileReceived(file, header.from));
	}

	_onChunkReceived(chunk) {
		if (!chunk.byteLength) return;

		this._digester.unchunk(chunk);
		const progress = this._digester.progress;
		this._onDownloadProgress(progress);

		// occasionally notify sender about our progress
		if (progress - this._lastProgress < 0.01) return;
		this._lastProgress = progress;
		this._sendProgress(progress);
	}

	_onDownloadProgress(progress) {
		this.bus.$emit('file-progress', {
			sender: this._peerId,
			progress: progress,
			filesQueue: this._filesQueue.length + 1,
			files: this._files
		});
	}

	_onFileReceived(proxyFile, from) {
		const file = {
			file: proxyFile,
			from: from
		}
		this.bus.$emit('file-received', file);
		this.sendJSON({type: 'transfer-complete'});
	}

	_onTransferCompleted() {
		this._onDownloadProgress(1);
		this._reader = null;
		this._busy = false;
		this._dequeueFile();
		this.bus.$emit('notify-user', 'File transfer completed.');
	}

	sendText(text) {
		const unescaped = btoa(unescape(encodeURIComponent(text)));
		this.sendJSON({type: 'text', text: unescaped});
	}

	_onTextReceived(message) {
		const escaped = decodeURIComponent(escape(atob(message.text)));
		this.bus.$emit('text-received', {text: escaped, sender: this._peerId});
	}
}

class RTCPeer extends Peer {

	constructor(serverConnection, peerId, bus) {
		super(serverConnection, peerId, bus);
		if (!peerId) return; // we will listen for a caller
		this._connect(peerId, true);
		this.bus.$on('close-connection', () => this._closeConnection());
	}

	_connect(peerId, isCaller) {
		if (!this._conn) this._openConnection(peerId, isCaller);

		if (isCaller) {
			this._openChannel();
		} else {
			this._conn.ondatachannel = e => this._onChannelOpened(e);
		}
	}

	_openConnection(peerId, isCaller) {
		this._isCaller = isCaller;
		this._peerId = peerId;
		this._conn = new RTCPeerConnection(RTCPeer.config);
		this._conn.onicecandidate = e => this._onIceCandidate(e);
		this._conn.onconnectionstatechange = e => this._onConnectionStateChange(e);
		this._conn.oniceconnectionstatechange = e => this._onIceConnectionStateChange(e);
	}

	_closeConnection(e) {
		if (!this._conn) return;
		this._conn.close();
		this._conn = null;
	}

	_openChannel() {
		const channel = this._conn.createDataChannel('data-channel', {
			ordered: true,
			reliable: true // Obsolete. See https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel/reliable
		});

		channel.onopen = e => this._onChannelOpened(e);
		this._conn.createOffer().then(d => this._onDescription(d)).catch(e => this._onError(e));
	}

	_onDescription(description) {
		// description.sdp = description.sdp.replace('b=AS:30', 'b=AS:1638400');
		this._conn.setLocalDescription(description)
			.then(() => this._sendSignal({sdp: description}))
			.catch(e => this._onError(e));
	}

	_onIceCandidate(event) {
		if (!event.candidate) return;
		this._sendSignal({ice: event.candidate});
	}

	onServerMessage(message) {
		if (!this._conn) this._connect(message.sender, false);
		if (message.sdp) {
			this._conn.setRemoteDescription(new RTCSessionDescription(message.sdp))
				.then(() => {
					if (message.sdp.type === 'offer') {
						return this._conn.createAnswer()
							.then(d => this._onDescription(d));
					}
				})
				.catch(e => this._onError(e));
		} else if (message.ice) {
			this._conn.addIceCandidate(new RTCIceCandidate(message.ice));
		}
	}

	_onChannelOpened(event) {
		console.log('RTC: channel opened with', this._peerId);
		const channel = event.channel || event.target;
		channel.binaryType = 'arraybuffer';
		channel.onmessage = e => this._onMessage(e.data);
		channel.onclose = () => this._onChannelClosed();
		this._channel = channel;
	}

	_onChannelClosed() {
		console.log('RTC: channel closed', this._peerId);
		if (!this.isCaller) return;
		this._connect(this._peerId, true); // reopen the channel
	}

	_onConnectionStateChange() {
		console.log('RTC: state changed:', this._conn.connectionState);
		switch (this._conn.connectionState) {
			case 'disconnected':
				this._onChannelClosed();
				break;
			case 'failed':
				this._conn = null;
				this._onChannelClosed();
				break;
		}
	}

	_onIceConnectionStateChange() {
		switch (this._conn.iceConnectionState) {
			case 'failed':
				console.error('ICE Gathering failed');
				break;
			default:
				console.log('ICE Gathering', this._conn.iceConnectionState);
		}
	}

	_onError(error) {
		console.error(error);
	}

	_send(message) {
		if (!this._channel) return this.refresh();
		this._channel.send(message);
	}

	_sendSignal(signal) {
		signal.type = 'signal';
		signal.to = this._peerId;
		this._server.send(signal);
	}

	refresh() {
		// check if channel is open. otherwise create one
		if (this._isConnected() || this._isConnecting()) return;
		this._connect(this._peerId, this._isCaller);
	}

	_isConnected() {
		return this._channel && this._channel.readyState === 'open';
	}

	_isConnecting() {
		return this._channel && this._channel.readyState === 'connecting';
	}
}

export class PeersManager {

	constructor(serverConnection, bus) {
		this.peers = {};
		this._server = serverConnection;

		this.bus = bus;
		this.destory();

		this.bus.$on('signal', e => this._onMessage(e));
		this.bus.$on('peers', e => this._onPeers(e));
		this.bus.$on('files-selected', e => this._onFilesSelected(e));
		this.bus.$on('send-text', e => this._onSendText(e));
		this.bus.$on('peer-left', e => this._onPeerLeft(e));
	}

	destory() {
		console.log('destroying peers manager');
		this.bus.$off('signal');
		this.bus.$off('peers');
		this.bus.$off('files-selected');
		this.bus.$off('send-text');
		this.bus.$off('peer-left');
	}

	_onMessage(message) {
		if (!this.peers[message.sender]) {
			this.peers[message.sender] = new RTCPeer(this._server, null, this.bus);
		}
		this.peers[message.sender].onServerMessage(message);
	}

	_onPeers(peers) {
		peers.forEach(peer => {
			if (this.peers[peer.id]) {
				this.peers[peer.id].refresh();
				return;
			}
			if (window.isRtcSupported && peer.rtcSupported) {
				this.peers[peer.id] = new RTCPeer(this._server, peer.id, this.bus);
			} else {

				this.peers[peer.id] = new WSPeer(this._server, peer.id);
			}
		})
	}

	sendTo(peerId, message) {
		this.peers[peerId].send(message);
	}

	_onFilesSelected(message) {
		message.files.forEach(file => {
			file.from = message.from;
		});
		this.peers[message.to].sendText(message.files.length);
		this.peers[message.to].sendFiles(message.files);
	}

	_onSendText(message) {
		// console.log("send text", message);
		this.peers[message.to].sendText(message.text);
	}

	_onPeerLeft(peerId) {
		const peer = this.peers[peerId];
		delete this.peers[peerId];
		if (!peer || !peer._peer) return;
		peer._peer.close();
	}

}

class WSPeer {
	_send(message) {
		message.to = this._peerId;
		this._server.send(message);
	}
}

class FileChunker {

	constructor(file, onChunk, onPartitionEnd) {
		this._chunkSize = 64000; // 64 KB
		this._maxPartitionSize = 1e6; // 1 MB
		this._offset = 0;
		this._partitionSize = 0;
		this._file = file;
		this._onChunk = onChunk;
		this._onPartitionEnd = onPartitionEnd;
		this._reader = new FileReader();
		this._reader.addEventListener('load', e => this._onChunkRead(e.target.result));
	}

	get progress() {
		return this._offset / this._file.size;
	}

	nextPartition() {
		this._partitionSize = 0;
		this._readChunk();
	}

	_readChunk() {
		const chunk = this._file.slice(this._offset, this._offset + this._chunkSize);
		this._reader.readAsArrayBuffer(chunk);
	}

	_onChunkRead(chunk) {
		this._offset += chunk.byteLength;
		this._partitionSize += chunk.byteLength;
		this._onChunk(chunk);
		if (this._isPartitionEnd() || this.isFileEnd()) {
			this._onPartitionEnd(this._offset);
			return;
		}
		this._readChunk();
	}

	repeatPartition() {
		this._offset -= this._partitionSize;
		this._nextPartition();
	}

	_isPartitionEnd() {
		return this._partitionSize >= this._maxPartitionSize;
	}

	isFileEnd() {
		return this._offset >= this._file.size;
	}
}

class FileDigester {

	constructor(meta, callback) {
		this._buffer = [];
		this._bytesReceived = 0;
		this._size = meta.size;
		this._mime = meta.mime || 'application/octet-stream';
		this._name = meta.name;
		this._callback = callback;
	}

	unchunk(chunk) {
		this._buffer.push(chunk);
		this._bytesReceived += chunk.byteLength || chunk.size;
		// const totalChunks = this._buffer.length;
		this.progress = this._bytesReceived / this._size;
		if (isNaN(this.progress)) this.progress = 1

		if (this._bytesReceived < this._size) return;
		// we are done
		let blob = new Blob(this._buffer, {type: this._mime});
		this._callback({
			name: this._name,
			mime: this._mime,
			size: this._size,
			blob: blob
		});
	}

}


RTCPeer.config = {
	'sdpSemantics': 'unified-plan',
	'iceServers': [{
		urls: 'stun:stun.l.google.com:19302'
	}]
}
