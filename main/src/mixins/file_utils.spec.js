import { expect, test, describe } from 'vitest'
import { renderSize } from './file_utils'

describe('renderSize', () => {
	test.each([
		[0, '0 Bytes'],
		[10, '10 Bytes'],
		[1024, '1 KB'],
		[1800, '1.76 KB'],
		[1024 ** 2, '1 MB'],
		[1024 ** 3, '1 GB'],
		[2.5 * 1024 ** 3, '2.5 GB'],
		[1024 ** 4, '1 TB'],
		[1024 ** 5, '1 PB'],
		[2 * 1024 ** 5, '2 PB'],
		[1024**6, '1 EB'],
	])('format %s bytes as %s', (bytes, formattedSize) => {
		expect(renderSize(bytes)).toEqual(formattedSize)
	})
})