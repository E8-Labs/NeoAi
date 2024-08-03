import { Inter } from "next/font/google";
//globals is important for nav
import "./../globals.css";
import "../../public/assets/styles/styles.css";
import NavLinks from "@/public/assets/Nav/NavLinks";
import { Button } from "@mui/material";
import Chatsidenav from "@/public/chatNav/chatsidenav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

const backgroundImage = {
    backgroundImage: 'url("../background.png")',
    backgroundSize: "cover",
    backgroundPosition: 'center',
    width: '100%',
    height: 'auto'
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                {/* Code for popins */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
                {/* Code for inter */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />

            </head>
            <body className={inter.className} style={{ backgroundColor: "#050221", width: '100%', overflowX: "hidden", height: "100%", overflowY: "hidden" }}>
                <div className="flex w-full flex-row">
                    <div className="w-2/12" style={{ borderRight: "1px solid grey", backgroundColor: "#050221" }}>
                        {/* <chatsidenav /> */}
                        <Chatsidenav />
                    </div>
                    <div className="flex flex-col w-10/12">
                        <div>
                            {children}
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
