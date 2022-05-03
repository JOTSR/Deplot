import { App } from '../../deps.ts'
import { ChartJs } from '../../deps.ts'
  
const indexPath = `file://${Deno.cwd()}/public/index.html`

async function plot(plotEngine: typeof ChartJs, windowTitle: string, config: ChartJs.ChartConfiguration)/*: Promise<App>*/: Promise<unknown>
async function plot(plotEngine: typeof ChartJs, windowTitle: string, ...args: unknown[])/*: Promise<App>*/ {
    // const app = await App.new()
    // app.registerWindow({ title: windowTitle, url: indexPath })

    // if (typeof plotEngine === typeof ChartJs) {
        
    //     const [config] = args
        
    //     app.send(`
    //         const ChartJs await import('https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js')

    //         const canvas = document.createElement('canvas')
    //         canvas.width = window.innerWidth
    //         canvas.height = window.innerHeight

    //         const ctx = canvas.getContext('2d')

    //         new ChartJs.Chart(ctx, JSON.parse(${config}))
    //     `)

    //     app.run()

    //     return app
    // }

    throw new Error('Unsupported plotEngine')
}



export { plot }