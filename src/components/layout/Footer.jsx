import { Link } from 'react-router-dom'

const currentYear = new Date().getFullYear()

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/Baliguini-dimi' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dimitri-nelson-baligini-demba-4b17b32ba' },
  { label: 'Email', href: 'mailto:dbaliguini@gmail.com' },
  { label: 'Telephone', href: 'tel:+2250779917447' },
  { label: 'WhatsApp', href: 'https://wa.me/23672380384' },
  { label: 'Instagram', href: 'https://www.instagram.com/dems_nb/' },
  { label: 'X', href: 'https://x.com/baliguini_fils' },
]

function Footer() {
  return (
    <footer className="border-t border-surface mt-24">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="font-body text-sm text-mist">
          Copyright {currentYear} Dimitri Nelson Baliguini Demba
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {socialLinks.map((item) => {
            const isExternal = item.href.startsWith('http')
            return (
              
                key={item.label}
                href={item.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="font-body text-sm text-mist hover:text-signal transition-colors"
              >
                {item.label}
              </a>
            )
          })}
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-6 flex justify-center sm:justify-end">
        <Link
          to="/admin"
          className="font-mono text-xs text-mist/50 hover:text-mist transition-colors"
        >
          Admin
        </Link>
      </div>
    </footer>
  )
}

export default Footer