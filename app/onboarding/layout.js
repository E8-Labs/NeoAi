import { Inter } from "next/font/google";
//globals is important for nav
// import "../public/assets/styles/styles.css";
import "./navCss.css";
import "../../public/assets/styles/styles.css";
import { Button } from "@mui/material";
import NavLinks from "@/public/assets/Nav/NavLinks";
import Login from "@/public/ui/Login";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

const grad = {
    background: 'linear-gradient(to right, #03002A, #040121)'
}

const handleLogin = () => {
    Router.push('/auth/signin');
}

const backgroundImage = {
    backgroundImage: 'url("../background.png")',
    backgroundSize: "cover",
    backgroundPosition: 'center',
    width: '100%',
    height: '10vh'
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
            <body className={inter.className} style={backgroundImage}>
                <div style={{ marginTop: 10, }}>
                    <div className="w-screen flex flex-row items-center justify-between px-12">
                        <button>
                            <img src="/assets/logo.png" style={{ height: '37px', width: '36px', resize: 'cover' }} />
                        </button>
                        <div className="flex flex-row gap-2 items-center text-white">
                            {/*<NavLinks />
                            <Button
                                // onClick={()=> router.push('/onboarding')}
                                href="/chat"
                                className="gap-2 flex-row rounded-md p-3 py-4 "
                                style={{ height: '40px', color: 'white', fontWeight: '500', fontSize: 15, backgroundColor: '#4011FA', fontFamily: 'inter' }}>
                                Get Started
                            </Button>*/}
                            <Login />
                        </div>
                    </div>
                    <div>
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}
