export default function Footer() {
    return (
        <div className="flex flex-col items-center w-full font-light text-sm">
            <div className="flex">
                <a href="mailto:hello@quibbble.com">
                    <p>Contact</p>
                </a>
                <p className="mx-2 md:mx-4">/</p>
                <a href="https://www.buymeacoffee.com/quibbble" target="_blank" rel="noreferrer">
                    <p>Support</p>
                </a>
                <p className="mx-2 md:mx-4">/</p>
                <a href="https://discord.gg/VKvjutuhUp" target="_blank" rel="noreferrer">
                    <p>Discord</p>
                </a>
                <p className="mx-2 md:mx-4">/</p>
                <a href="https://status.quibbble.com" target="_blank" rel="noreferrer">
                    <p>Status</p>
                </a>
                <p className="mx-2 md:mx-4">/</p>
                <a href="https://github.com/quibbble" target="_blank" rel="noreferrer">
                    <p>Code</p>
                </a>
            </div>
            <p className="mt-2 italic">Made with 🤍 by <a className="underline" href="https://chrisfregly.com" target="_blank" rel="noreferrer">Chris Fregly</a></p>
        </div>
    )
}
