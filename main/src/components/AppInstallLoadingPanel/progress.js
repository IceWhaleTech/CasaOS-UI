/*
 * @Author: Jerryk jerry@icewhale.org
 * @Date: 2022-12-24 15:06:48
 * @LastEditors: Jerryk jerry@icewhale.org
 * @LastEditTime: 2023-02-06 18:34:40
 * @FilePath: /CasaOS-UI/src/components/Apps/progress.js
 * @Description: 
 * 
 * Copyright (c) 2022 by IceWhale, All Rights Reserved. 
 */

import filter from 'lodash/filter';
import meanBy from 'lodash/meanBy';

class ProgressTracker {
	constructor(coalesceBelow = 0) {
		this.coalesceBelow = coalesceBelow;
		this.layers = {};
	}

	addLayer(id) {
		this.layers[id] = {progress: null, coalesced: false};
	}

	linkLayer(id, tracker) {
		this.layers[id] = tracker.layers[id];
	}

	updateLayer(id, progress) {
		if (id == null) {
			return;
		}
		if (!this.layers[id]) {
			this.addLayer(id);
		}
		this.patchProgressEvent(progress);
		this.layers[id].coalesced =
			this.layers[id].progress == null && progress.total < this.coalesceBelow;
		this.layers[id].progress = progress.current / progress.total || 0;
	}

	finishLayer(id) {
		this.updateLayer(id, {current: 1, total: 1});
	}

	getProgress() {
		const layers = filter(this.layers, {coalesced: false});
		const avgProgress = meanBy(layers, 'progress') || 0;
		return Math.round(100 * avgProgress);
	}

	patchProgressEvent(progress) {
		if (progress.total == null) {
			progress.total = progress.current;
		}
		progress.current = Math.min(progress.current, progress.total);
	}

}

class DockerProgress {
	constructor() {
		this.downloadProgressTracker = new ProgressTracker(100 * 1024);
		this.extractionProgressTracker = new ProgressTracker(1024 * 1024);
		this.lastPercentage = 0;
	}

	getProgress(evt) {
		let id;
		let status;
		try {
			let downloadedPercentage;
			let extractedPercentage;
			({id, status} = evt);
			if (id == null) {
				id = '';
			}
			if (status == null) {
				status = '';
			}
			if (status === 'Pulling fs layer') {
				this.downloadProgressTracker.addLayer(id);
				this.extractionProgressTracker.addLayer(id);
			} else if (status === 'Ready to download') {
				this.downloadProgressTracker.linkLayer(id, evt.extractionProgressTracker);
			} else if (status === 'Downloading') {
				this.downloadProgressTracker.updateLayer(id, evt.progressDetail);
			} else if (status === 'Extracting') {
				this.extractionProgressTracker.updateLayer(id, evt.progressDetail);
			} else if (status === 'Download complete') {
				this.downloadProgressTracker.finishLayer(id);
			} else if (status === 'Pull complete') {
				this.extractionProgressTracker.finishLayer(id);
			} else if (status === 'Already exists') {
				this.downloadProgressTracker.finishLayer(id);
				this.extractionProgressTracker.finishLayer(id);
			}
			if (status.startsWith('Status: Image is up to date for ') ||
				status.startsWith('Status: Downloaded newer image for ')) {
				downloadedPercentage = 100;
				extractedPercentage = 100;
			} else {
				downloadedPercentage = this.downloadProgressTracker.getProgress();
				extractedPercentage = this.extractionProgressTracker.getProgress();
			}
			let percentage = Math.floor((downloadedPercentage + extractedPercentage) / 2);
			percentage = this.lastPercentage = Math.max(percentage, this.lastPercentage);
			return percentage;
		} catch (err) {
			console.log(err);
		}


	}
}

export default DockerProgress;