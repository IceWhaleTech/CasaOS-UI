<template>
	<div class="uploader is-flex is-flex-direction-column">
		<slot :file-list="fileList" :files="files" :started="started">
			<uploader-unsupport></uploader-unsupport>
			<uploader-drop>
				<p>Drop files here to upload or</p>
				<uploader-btn>select files</uploader-btn>
				<uploader-btn :directory="true">select folder</uploader-btn>
			</uploader-drop>
			<uploader-list></uploader-list>
		</slot>
	</div>
</template>

<script>
import Uploader from 'simple-uploader.js'
import { kebabCase } from '../common/utils'
import UploaderBtn from './btn.vue'
import UploaderDrop from './drop.vue'
import UploaderUnsupport from './unsupport.vue'
import UploaderList from './list.vue'
// import UploaderFiles from './files.vue'
// import UploaderFile from './file.vue'

const COMPONENT_NAME = 'uploader'
const FILE_ADDED_EVENT = 'fileAdded'
const FILES_ADDED_EVENT = 'filesAdded'
const UPLOAD_START_EVENT = 'uploadStart'

export default {
	name: COMPONENT_NAME,
	provide() {
		return {
			uploader: this
		}
	},
	props: {
		options: {
			type: Object,
			default() {
				return {}
			}
		},
		autoStart: {
			type: Boolean,
			default: true
		},
		fileStatusText: {
			type: [Object, Function],
			default() {
				return {
					success: 'success',
					error: 'error',
					Uploading: 'Uploading',
					paused: 'paused',
					waiting: 'waiting'
				}
			}
		}
	},
	data() {
		return {
			started: false,
			files: [],
			fileList: []
		}
	},
	methods: {
		uploadStart() {
			this.started = true
		},
		fileAdded(file) {
			this.$emit(kebabCase(FILE_ADDED_EVENT), file)
			if (file.ignored) {
				// is ignored, filter it
				return false
			}
		},
		filesAdded(files, fileList) {
			this.$emit(kebabCase(FILES_ADDED_EVENT), files, fileList)
			if (files.ignored || fileList.ignored) {
				// is ignored, filter it
				return false
			}
		},
		fileRemoved() {
			this.files = this.uploader.files
			this.fileList = this.uploader.fileList
		},
		filesSubmitted() {
			this.files = this.uploader.files
			this.fileList = this.uploader.fileList
			this.$api.sys.getVersion().then(res => {
				if (this.autoStart && res.status === 200) {
					this.uploader.opts.headers.Authorization = this.$store.state.access_token || localStorage.getItem("access_token")
					this.uploader.upload()
				}
			})
		},
		fileErrorHandle(rootFile, file, message) {
			this.uploader.pause(file)
			this.$buefy.toast.open({
				message: JSON.parse(message).message,
				type: 'is-danger',
				position: 'is-top',
				duration: 5000
			})
		},
		allEvent(...args) {
			const name = args[0]
			const EVENTSMAP = {
				[FILE_ADDED_EVENT]: true,
				[FILES_ADDED_EVENT]: true,
				[UPLOAD_START_EVENT]: 'uploadStart'
			}
			const handler = EVENTSMAP[name]
			if (handler) {
				if (handler === true) {
					return
				}
				this[handler].apply(this, args.slice(1))
			}
			args[0] = kebabCase(name)
			this.$emit.apply(this, args)
		}
	},
	created() {
		// eslint-disable-next-line vue/no-mutating-props
		this.options.initialPaused = !this.autoStart
		const uploader = new Uploader(this.options)
		this.uploader = uploader
		this.uploader.fileStatusText = this.fileStatusText
		uploader.on('catchAll', this.allEvent)
		uploader.on(FILE_ADDED_EVENT, this.fileAdded)
		uploader.on(FILES_ADDED_EVENT, this.filesAdded)
		uploader.on('fileRemoved', this.fileRemoved)
		uploader.on('filesSubmitted', this.filesSubmitted)
		uploader.on('fileError', this.fileErrorHandle)
	},
	destroyed() {
		const uploader = this.uploader
		uploader.off('catchAll', this.allEvent)
		uploader.off(FILE_ADDED_EVENT, this.fileAdded)
		uploader.off(FILES_ADDED_EVENT, this.filesAdded)
		uploader.off('fileRemoved', this.fileRemoved)
		uploader.off('filesSubmitted', this.filesSubmitted)
		uploader.off('fileError')
		this.uploader = null
	},
	components: {
		UploaderBtn,
		UploaderDrop,
		UploaderUnsupport,
		UploaderList,
		// UploaderFiles,
		// UploaderFile
	}
}
</script>

<style>
.uploader {
	height: 100%;
	position: relative;
}
</style>
