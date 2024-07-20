'use client';
import { Poppins } from 'next/font/google';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import clsx from "clsx";

const links = [
    {
        name: 'Home',
        href: '/',
    },
    {
        name: 'Contact',
        href: '/contact',
    },
    {
        name: 'Documentation',
        href: '/documentation',
    },
    // {
    //     name: 'Enterprise',
    //     href: '/documentation',
    // },
    // {
    //     name: 'Zapier',
    //     href: '/documentation',
    // },
    // {
    //     name: 'No_Code',
    //     href: '/documentation',
    // },
    // {
    //     name: 'Careers',
    //     href: '/documentation',
    // },
    // {
    //     name: 'Blog',
    //     href: '/documentation',
    // },
    // {
    //     name: 'Turbo Demo',
    //     href: '/documentation',
    // },
    // {
    //     name: 'Web Demo',
    //     href: '/documentation',
    // },
    // {
    //     name: 'Pricing',
    //     href: '/documentation',
    // },
];

//code for fonts
const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
});

export default function NavLinks() {
    const pathName = usePathname();

    const router = useRouter();

    return (
        <div className='flex flex-row'>
            {links.map((link, index) => {
                return (
                    <div className='flex flex-row h-15 items-center justify-center gap-1 rounded-3xl text-sm font-medium hover:bg-white md:flex-row md:justify-center md:items-center md:px-3 py-1'
                        key={index}>
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(
                                'flex flex-row h-15 items-center justify-center gap-1 rounded-3xl text-sm font-medium hover:bg-white md:flex-row md:justify-center md:items-center md:px-3 py-1',
                                {
                                    'bg-white': pathName === link.href,
                                },
                            )}
                        >
                            {pathName === link.href ? ( // Check if the link is focused
                                <li style={{ fontSize: 15, fontWeight: '500', color: 'white', fontFamily: 'popins' }}>
                                    Why Neo
                                </li>
                            ) : (
                                <li className='ms-6' style={{ fontSize: 15, fontWeight: '500', color: 'white', fontFamily: 'popins' }}>
                                    {link.name}
                                </li>
                            )}
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
