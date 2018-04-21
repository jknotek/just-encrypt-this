
# Just Encrypt This
A minimal, portable, fully in-browser encryption utility for plaintext messages.

---

Just-Encrypt-This (JET) was designed to be small, portable, and trust-less.
Encryption happens in-browser, with nothing sent to a server. In fact, the
entire application can be downloaded and used offline for both encryption and
decryption by simply using "Save Page As..." — it's fully contained within a
single, 32KB HTML file when compiled (11KB gzipped).

You can try it out live at [jknotek.com/jet](https://jknotek.com/jet). If you're
interested in reading the inspiration behind it, you can also take a look at
[this writeup](https://blog.jknotek.com/posts/in-browser-encryption-a-too-perfect-approach).

It currently uses the popular [SJCL](https://github.com/bitwiseshiftleft/sjcl)
encryption library for JavaScript. The plan is to move to the
[WebCryptoAPI](https://www.w3.org/TR/WebCryptoAPI/) when browser support
eventually catches on... Perhaps as a fork rather than an upgrade.

## Building

### Requirements
The only build requirements are `node` and `npm`. The dependencies are specified
in the `package.json` file, and will be installed automatically using the steps
below.

### Build Steps
After cloning the repository, `cd` into its directory and run the following:

1. `npm install`

2. `npm run build`

And that's basically it. You will be left with a completely self-contained,
portable HTML file (`dist/index.html`) that can be moved around or uploaded to
your own server with no hassle.

## License
**(ISC License)**

Copyright 2018 Jacob Knotek

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
