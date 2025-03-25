import Link from 'next/dist/client/link'
import React from 'react'

const PageHeader: React.FC = () => {
  return (
    <header>
        <a href="">Bites N' Click Logo</a>
        <nav>
          <Link href={''}>Home</Link>
          <Link href={''}>Products</Link>
          <Link href={''}>About</Link>
          <Link href={''}>Contact Us</Link>
        </nav>
    </header>
  )
}

export default PageHeader;