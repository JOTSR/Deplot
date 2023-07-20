import { Base64, ensureFile, path, WebUI } from '../deps.ts'
import { Config, Datas, DeplotOptions, PlotEngine } from './types.ts'

import { bundle } from '../public/bundle.ts'
import { plotly } from '../public/plotly.ts'
function fileHandler({ pathname }: URL) {
	if (pathname === '/plotly.js') return plotly
	throw new Error(`uknown path ${pathname}`)
}

export class Deplot {
	#plotEngine: PlotEngine
	#options: DeplotOptions
	#window: WebUI
	#datas?: Datas
	#config: Config
	#html = bundle

	constructor(
		plotEngine: PlotEngine,
		options: DeplotOptions = {
			closeCallback: () => undefined,
		},
	) {
		this.#plotEngine = plotEngine
		this.#options = { ...options }
		this.#window = new WebUI()
		this.#window.setFileHandler(fileHandler)

		this.#config = { title: plotEngine, size: [500, 500] }
	}

	static wait() {
		return WebUI.wait()
	}

	async plot(datas: Datas, config?: Config) {
		this.#datas = datas
		this.#config = { ...this.#config, ...config }

		await this.#window.show(this.#html)

		this.#window.run(`DeplotClient.engine = "${this.#plotEngine}"`)
		this.#window.run(
			`DeplotClient.plot(${JSON.stringify(datas)}, ${
				JSON.stringify(config)
			})`,
		)
	}

	update(datas: Datas, config?: Config) {
		this.plot({ ...this.#datas, ...datas }, config)
	}

	close() {
		this.#window.close()
	}

	async capture(
		fileName: string,
		callback?: (path: string) => void,
	) {
		try {
			if (!this.#window.isShown) throw new Error('plot is not displayed')

			const dataUrl = await this.#window.script(
				'return await DeplotClient.capture()',
			)
			const [_, __, base64] = dataUrl.match(/(.+,)?(.+)/)!

			const image = Base64.decode(base64)
			const filePath = path.join(Deno.cwd(), fileName)
			ensureFile(filePath)
			await Deno.writeFile(filePath, image)
			callback?.(filePath)
		} catch (cause) {
			throw new Error(
				`unable to take the screenShot`,
				{ cause },
			)
		}
	}
}
