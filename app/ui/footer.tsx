'use client'

export default function Header()
{
    return (
        <footer className="bg-blue-500 text-white h-60 lg:h-40 lg:py-0 py-5 lg:px-[15%] px-0 flex flex-col lg:flex-row lg:justify-between justify-center gap-5 items-center">
            <ul className="order-1">
                <li><b>NIP: </b>5140360681</li>
                <li><b>REGON: </b>525755870</li>
            </ul>
            <div className="h-full flex flex-col justify-end order-3 lg:order-2 text-center">
            <ul className="text-[12px]">
                <li>Developed by <a href="mailto:stajszczykszymon@gmail.com" className="font-bold">stajszczykszymon@gmail.com</a></li>
            </ul>
            </div>
            <ul className="order-2 lg:order-3">
                <li><b>Oreka Ewa Gruszczyńska</b></li>
                <li><b>E-mail: </b><a href="mailto:oreka.eg@gmail.com">oreka.eg@gmail.com</a></li>
                <li><b>Tel. </b><a href="tel:+48501040880">+48 501 040 880</a></li>
            </ul>
        </footer>
    )
}