import { ensureFile, path, WebUI } from '../deps.ts'
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

	plot(datas: Datas, config: Config): Deplot {
		this.#datas = datas
		this.#config = { ...this.#config, ...config }

		this.#window.show(this.#html)
		const it = setInterval(() => {
			this.#window.run(`DeplotClient.engine = "${this.#plotEngine}"`)
			this.#window.run(
				`DeplotClient.plot(${JSON.stringify(datas)}, ${
					JSON.stringify(config)
				})`,
			)
			if (this.#window.isShown) clearInterval(it)
		}, 500)
		return this
	}

	update(datas: Datas, config: Config): Deplot {
		return this.plot({ ...this.#datas, ...datas }, config)
	}

	close(): Deplot {
		this.#window.close()
		return this
	}

	async screenShot(fileName: string, callback: (path: string) => unknown) {
		try {
			const image = await this.#window.script('takeScreenshot()')
			const filePath = path.join(Deno.cwd(), fileName)
			ensureFile(filePath)
			await Deno.writeFile(filePath, new TextEncoder().encode(image))
			callback(filePath)
		} catch (cause) {
			throw new Error(
				`Unable to take the screenShot`,
				{ cause },
			)
		}
	}
}
