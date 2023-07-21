import { Base64, ensureFile, path, WebUI } from '../deps.ts'
import {
	Datas,
	DeplotOptions,
	PlotEngine,
	RequiredDeplotOptions,
} from './types.ts'

import { bundle } from '../public/bundle.ts'
import { plotly } from '../public/plotly.ts'
function fileHandler({ pathname }: URL) {
	if (pathname === '/plotly.js') return plotly
	throw new Error(`uknown path ${pathname}`)
}

export class Deplot {
	#plotEngine: PlotEngine
	#options: RequiredDeplotOptions
	#window: WebUI
	#datas?: Datas
	#html = bundle

	constructor(
		plotEngine: PlotEngine,
		options: DeplotOptions,
	) {
		this.#plotEngine = plotEngine
		this.#window = new WebUI()
		this.#window.setFileHandler(fileHandler)

		const size = { ...{ width: 500, height: 500 }, ...options.size }
		const title = options.title ?? 'Deplot'
		const closeCallback = options.closeCallback
		this.#options = { title, size, closeCallback } as RequiredDeplotOptions
	}

	static wait() {
		return WebUI.wait()
	}

	async plot(datas: Datas) {
		this.#datas = datas

		await this.#window.show(this.#html)
		//wait to await for client js to be executed
		await new Promise((resolve) => setTimeout(resolve))

		//config window
		await this.setSize(this.#options.size)
		this.title = this.#options.title

		//update plot
		this.#window.run(`DeplotClient.engine = "${this.#plotEngine}"`)
		this.#window.run(`DeplotClient.plot(${JSON.stringify(datas)})`)
	}

	update(datas: Datas) {
		this.plot({ ...this.#datas, ...datas })
	}

	close() {
		this.#window.close()
	}

	async capture(
		fileName: string,
		callback?: (path: string) => void | Promise<void>,
	) {
		try {
			if (!this.#window.isShown) throw new Error('plot is not displayed')

			const dataUrl = await this.#window.script(
				'return (await DeplotClient.capture()) + " ".repeat(22)',
				{ bufferSize: 5e5 * 8 },
			)

			const [_, __, base64] = dataUrl.match(/(.+,)?(.+)/)!
			const image = Base64.decode(base64)
			const filePath = path.join(Deno.cwd(), fileName)
			await ensureFile(filePath)
			await Deno.writeFile(filePath, image)
			await callback?.(filePath)
		} catch (cause) {
			throw new Error(
				`unable to take the screenShot`,
				{ cause },
			)
		}
	}

	set title(title: string) {
		if (!this.#window.isShown) throw new Error('plot is not displayed')
		this.#window.run(`DeplotClient.title = '${title}'`)
	}
	get title() {
		if (!this.#window.isShown) throw new Error('plot is not displayed')
		return this.#options.title
	}

	setSize({ width, height }: { width?: number; height?: number }) {
		if (!this.#window.isShown) throw new Error('plot is not displayed')
		if (width !== undefined) {
			if (
				!Number.isInteger(width) || (width < 100 || width > 10_000)
			) {
				throw new TypeError(
					`${width} is not a valid width, if defined width must be an integer between 100 and 10_000`,
				)
			}
		}
		if (height !== undefined) {
			if (
				!Number.isInteger(height) || (height < 100 || height > 10_000)
			) {
				throw new TypeError(
					`${height} is not a valid height, if defined height must be an integer between 100 and 10_000`,
				)
			}
		}
		this.#options.size = {
			width: width ?? this.#options.size.width,
			height: height ?? this.#options.size.height,
		}
		return this.#window.script(
			`DeplotClient.size = { width: ${width}, height: ${height} }`,
		)
	}
	async getSize() {
		if (!this.#window.isShown) throw new Error('plot is not displayed')
		const response = await this.#window.script('return DeplotClient.size')
		const { width, height } = JSON.parse(response) as {
			width: number
			height: number
		}
		this.#options.size = {
			width: width ?? this.#options.size.width,
			height: height ?? this.#options.size.height,
		}
		return { width, height }
	}
	setPosition({ x, y }: { x: number; y: number }) {
		if (!this.#window.isShown) throw new Error('plot is not displayed')
		if (!Number.isInteger(x) || x < 0) {
			throw new TypeError(
				`${x} is not a valid x position, if defined x must be a positive integer`,
			)
		}
		if (!Number.isInteger(y) || y < 0) {
			throw new TypeError(
				`${y} is not a valid y position, if defined y must be a positive integer`,
			)
		}
		this.#window.run(`DeplotClient.setPosition({ x: ${x}, y: ${y} })`)
	}
}
