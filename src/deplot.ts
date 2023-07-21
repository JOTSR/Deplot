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

	/**
	 * Init a new Deplot instance.
	 * # Usage
	 * @param {PlotEngine} plotEngine - Plot engine used for rendering and manipulating plots.
	 * @param {DeplotOptions} options - Initial configuration of the window,
	 * default is { title: 'Deplot', size: { width: 500, height: 500 } }.
	 * Close allback option is called when the window is closed either from the backend or the UI.
	 * # Examples
	 * - Simpliest usage
	 * ```ts
	 * const simple = new Deplot('Plotly')
	 * ```
	 * - Define title
	 * ```ts
	 * const titled = new Deplot('ChartJs', { title: 'My titled plot' })
	 * ```
	 * - Define size
	 * ```ts
	 * const sized = new Deplot('Plotly', { size: { width: 720, height: 480 } })
	 * ```
	 * - Define partial size
	 * ```ts
	 * const simple = new Deplot('ChartJs', { size: { height: 800 } })
	 * // Default width = 500
	 * ```
	 */
	constructor(
		plotEngine: PlotEngine,
		options?: DeplotOptions,
	) {
		this.#plotEngine = plotEngine
		this.#window = new WebUI()
		this.#window.setFileHandler(fileHandler)

		const size = { ...{ width: 500, height: 500 }, ...options?.size }
		const title = options?.title ?? 'Deplot'
		// const closeCallback = options.closeCallback
		this.#options = { title, size } as RequiredDeplotOptions
	}

	/**
	 * Prevent the main event loop to exit before all plots are closed.
	 * # Examples
	 * - Prevent event event loop to exit
	 * ```ts
	 * const barPlot = new Deplot('ChartJs')
	 * const histPlot = new Deplot('Plotly')
	 * // ...
	 * Deplot.wait()
	 * ```
	 */
	static wait() {
		return WebUI.wait()
	}

	/**
	 * Checks if the window is currently running.
	 * # Examples
	 * - Get display state
	 * ```ts
	 * const plot1 = new Deplot('Plotly')
	 * const plot2 = new Deplot('Plotly')
	 * await plot1.plot(...)
	 *
	 * plot1.isShown //true
	 * plot2.isShown //false
	 * ```
	 */
	get isShown() {
		return this.#window.isShown
	}

	/**
	 * Plot the `Datas` corresponding to the plot engine and open or refresh the window.
	 * @param {Datas} datas - Plot datas.
	 */
	async plot(datas: Datas) {
		this.#datas = datas

		await this.#window.show(this.#html)
		//wait for client js to be executed
		await new Promise((resolve) => setTimeout(resolve))

		//config window
		await this.setSize(this.#options.size)
		this.title = this.#options.title

		//update plot
		this.#window.run(`DeplotClient.engine = "${this.#plotEngine}"`)
		this.#window.run(`DeplotClient.plot(${JSON.stringify(datas)})`)
	}

	/**
	 * Merge the actual datas with new datas and refresh the UI.
	 * @param {Datas} datas - Datas to merge.
	 */
	update(datas: Datas) {
		this.plot({ ...this.#datas, ...datas })
	}

	/**
	 * Close the window.
	 * # Examples
	 * - Close the window
	 * ```ts
	 * const myPlot = new Deplot('ChartJs')
	 *
	 * myPlot.close()
	 * ```
	 */
	close() {
		this.#window.close()
	}

	/**
	 * Captures a screenshot of the plot and saves as png file.
	 * # Usage
	 * @param {string} fileName - file name to save the captured image as.
	 * @param [callback] - Called after the screenshot is captured and saved to a file.
	 * @throws {Error} - If UI not respond correctly or is there is an error when decoding and writing the file.
	 * # Examples
	 * - Take a screenshot of the plot
	 * ```ts
	 * 	const plot = new Deplot('Plotly', {
	 * 	 title: 'ChartJs line plot',
	 * 	 size: { width: 800, height: 800 },
	 * })
	 * //...
	 * await plot.plot(datas)
	 * await plot.capture('plotly.png')
	 * ```
	 * - Use capature callback
	 * ```ts
	 * 	const pie = new Deplot('ChartJs', {
	 * 	  title: 'ChartJs pie plot',
	 *  })
	 *  await pie.plot(datas)
	 *  await pie.capture(
	 * 	  'pie.png',
	 * 	  (path) => console.log(`capture saved to "${path}"`),
	 *  )
	 * ```
	 */
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

	/**
	 * Title of the window.
	 * # Examples
	 * - Set new title
	 * ```ts
	 * const myPlot = new Deplot('ChartJs', { title: 'Initial title' })
	 *
	 * myPlot.title = 'Updated title'
	 * ```
	 * - Get current title
	 * ```ts
	 * console.assert(myPlot.title, 'Updated title')
	 * ```
	 */
	set title(title: string) {
		if (!this.#window.isShown) throw new Error('plot is not displayed')
		this.#window.run(`DeplotClient.title = '${title}'`)
	}
	get title() {
		if (!this.#window.isShown) throw new Error('plot is not displayed')
		return this.#options.title
	}

	/**
	 * Resize the window and the plot.
	 * # Usage
	 * @param Size - { width, height } Must be integers between 100 and 10k.
	 * - Size is in pixel and define the absolute window size.
	 * - Undefined values are not updated.
	 *
	 * @returns Resolves when the size is updated.
	 * # Examples
	 * - Set window size
	 * ```ts
	 * const myPlot = new Deplot('ChartJs')
	 *
	 * const firstSize = await myPlot.setSize({ width: 720, height: 480 })
	 * ```
	 */
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

	/**
	 * Get the actual window size in pixels.
	 * # Usage
	 * @returns Promise<Size> - { width, height }.
	 * # Examples
	 * - Get window size
	 * ```ts
	 * const myPlot = new Deplot('Plotly')
	 *
	 * const firstSize = await myPlot.getSize()
	 * // Resize window through UI
	 * const secondSize = await myPlot.getSize()
	 * ```
	 */
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

	/**
	 * Set the window position in pixels.
	 * # Usage
	 * - (0, 0) is the top left corner of the screen
	 * - (ScreenWidth, ScreenHeight) is the bottom right corner of the screen
	 * @param Positions - { x, y } must be positives integers.
	 * # Examples
	 * - Center the plot on the screen
	 * ```ts
	 * const myPlot = new Deplot('Plotly')
	 *
	 * const { width, height } = await myPlot.getSize()
	 * myPlot.setPosition((1080 - height) / 2, (1920 - width) / 2)
	 * ```
	 */
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
