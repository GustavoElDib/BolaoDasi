"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import styles from "./Navbar.module.css";

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();
    const userName = session?.user?.name ?? null;

    // fecha dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function closeMenus() {
        setMenuOpen(false);
        setDropdownOpen(false);
    }

    const navLinks = userName
        ? [
            { href: "/", label: "Home" },
            { href: "/games", label: "Palpites" },
            { href: "/ranking", label: "Ranking" },
        ]
        : [
            { href: "/", label: "Home" },
            { href: "/login", label: "Login" },
        ];

    async function handleSignOut() {
        await signOut({ redirect: false });
        router.push("/login");
        router.refresh();
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.inner}>

                {/* brand: logo + texto */}
                <Link href="/" className={styles.brand} onClick={closeMenus}>
                    <Image
                        src="/grifo-logo.png"
                        alt="Logo DASI"
                        width={48}
                        height={48}
                        className={styles.logo}
                    />
                    Bolão DASI
                </Link>

                {/* links desktop */}
                <div className={styles.desktopLinks}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMenus}
                            className={`${styles.navLink} ${pathname === link.href ? styles.active : ""
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* user dropdown + hamburger */}
                <div className={styles.right}>
                    {userName && (
                        <div className={styles.userDropdown} ref={dropdownRef}>
                            <button
                                className={styles.userBtn}
                                onClick={() => setDropdownOpen((v) => !v)}
                                aria-expanded={dropdownOpen}
                            >
                                <div className={styles.avatar}>
                                    {userName.slice(0, 2).toUpperCase()}
                                </div>
                                <span className={styles.userName}>
                                    {userName}
                                </span>
                                <span
                                    className={`${styles.chevron} ${dropdownOpen ? styles.chevronUp : ""
                                        }`}
                                >
                                    ▾
                                </span>
                            </button>

                            {dropdownOpen && (
                                <div className={styles.dropdown}>
                                    <Link
                                        href="/profile"
                                        onClick={closeMenus}
                                        className={styles.dropdownItem}
                                    >
                                        Editar perfil
                                    </Link>
                                    <button
                                        className={`${styles.dropdownItem} ${styles.dropdownSignOut}`}
                                        onClick={handleSignOut}
                                    >
                                        Sair da conta
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* hamburger */}
                    <button
                        className={styles.hamburger}
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="Abrir menu"
                        aria-expanded={menuOpen}
                    >
                        <span className={`${styles.bar} ${menuOpen ? styles.barTop : ""}`} />
                        <span className={`${styles.bar} ${menuOpen ? styles.barMid : ""}`} />
                        <span className={`${styles.bar} ${menuOpen ? styles.barBot : ""}`} />
                    </button>
                </div>
            </div>

            {/* menu mobile */}
            <div
                className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""
                    }`}
            >
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMenus}
                        className={`${styles.mobileLink} ${pathname === link.href ? styles.mobileLinkActive : ""
                            }`}
                    >
                        {link.label}
                    </Link>
                ))}
                {userName && (
                    <>
                        <Link
                            href="/profile"
                            onClick={closeMenus}
                            className={styles.mobileLink}
                        >
                            ✏️ Editar perfil
                        </Link>
                        <button
                            className={`${styles.mobileLink} ${styles.mobileSignOut}`}
                            onClick={handleSignOut}
                        >
                            → Sair da conta
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}