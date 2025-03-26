'use client'

export default function Header()
{
    return (
        <footer className="h-40 lg:px-[15%] px-0 flex flex-col lg:flex-row lg:justify-between justify-center gap-5 items-center">
            <ul>
                <li><b>NIP: </b>5140360681</li>
                <li><b>REGON: </b>525755870</li>
            </ul>
            <ul>
                <li><b>Oreka Ewa Gruszczyńska</b></li>
                <li><b>E-mail: </b><a href="mailto:oreka.eg@gmail.com">oreka.eg@gmail.com</a></li>
                <li><b>Tel. </b><a href="tel:+48501040880">+48 501 040 880</a></li>
            </ul>
        </footer>
    )
}