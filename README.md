# Instalasi

## Catatan

Saya menggunakan **[Linux](https://docs.kernel.org)** sebagai sistem operasi utama-nya, namun ada kemungkinan Anda menggunakan **[Windows](https://www.microsoft.com/en-us/windows)** atau mungkin **[Mac](https://support.apple.com/id-id/109033)**.

Tapi, tutorial yang saya berikan hanya memberikan panduan untuk instalasi di sistem operasi Windows saja.

## Tools yang diperlukan:

### 1. [Bun](https://bun.sh)

Bun merupakan runtime ~~JavaScript~~ TypeScript. Ini merupakan alternatif dari **[NodeJS](https://nodejs.org/en)**. Alasan menggunakan Bun dan bukan NodeJS:

- Bun memiliki performa yang lebih cepat dibanding NodeJS dan **[Deno](https://deno.com)**.
  ![Grafik perbandingan Bun, Deno dan NodeJS](https://miro.medium.com/v2/resize:fit:640/format:webp/1*Oak5nm1AF13PXBb8fHH-sw.png)

- Bun sudah dapat menjalankan TypeScript tanpa perlu menginstall package tambahan ([typescript](https://www.npmjs.com/package/typescript), [ts-node](https://www.npmjs.com/package/ts-node), [nodemon](https://www.npmjs.com/package/nodemon)).

- Bun memiliki package manager nya sendiri yang lebih cepat dibanding **[NPM](https://npmjs.com)**, **[PNPM](https://pnpm.io/id)** dan **[Yarn](https://yarnpkg.com)**.
  ![Grafik perbandingan Bun, PNPM, NPM dan Yarn](https://www.freecodecamp.org/news/content/images/size/w1600/2023/09/266451126-23cbde35-b859-41b5-9480-98b88bf40c44.png)

- Bun memiliki bundler yang dapat mengcompile file TypeScript dan JavaScript menjadi 1 file executable.

- Bun memiliki utility yang cukup berguna sehingga kita tidak perlu menginstall beberapa package.

- Bun kompatibel dengan NodeJS, sehingga kalau kita membutuhkan package yang menggunakan NodeJS, package tersebut masih bisa dipakai menggunakan Bun.

Cara menginstall Bun:

1. Buka command prompt.
2. Jalankan perintah berikut:

```bat
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 2. [Docker](https://www.docker.com)

Docker merupakan sebuah tools untuk membungkus aplikasi dan dependensi - dependensi lainnya dalam sebuah container.

**Harap jangan malas membaca, penjelasan di bawah penting, agar mengerti kenapa harus pakai docker.**

Aplikasi API GoUmrah ini dibuat oleh saya dalam sistem operasi Linux, sehingga tools - tools seperti database, server, dll merupakan tools - tools yang khusus berjalan di Linux.

Maka agar aplikasi ini dapat dijalankan oleh kalian (dengan sistem operasi yang berbeda), saya putuskan untuk menggunakan Docker.

Jadi nanti tools - tools yang dibutuhkan untuk menjalankan aplikasi ini diinstall di semacam virtual machine kecil (container) yang akan dijalankan disitu juga.

Nanti, aplikasi API GoUmrah ini akan menggunakan tools - tools yang dijalankan di container tersebut, sehingga kalian tidak perlu menginstall sendiri database nya, kalian cukup menggunakan docker dan docker akan menginstallnya sendiri.

Kalian tidak perlu khawatir lagi dengan perbedaan sistem operasi, sebab docker akan menginstall tools - tools tersebut dalam sebuah virtual machine yang di dalam nya sudah diinstalkan juga sistem operasi kecil (Linux).

Sehingga ketika kita bisa menjalankan aplikasi di satu sistem operasi yang sama (yaitu Linux yang ada di container nya) walau sebenarnya sistem operasi komputer kita berbeda (Saya Linux dan mungkin Anda Windows).

Cara menginstall Docker:

1. Pastikan Windows kalian versi 11.
2. Buka CMD sebagai Administrator (Run as administrator).
3. Jalankan perintah berikut:

```bat
wsl --install
```

Perintah di atas akan mengaktifkan fitur WSL (Windows Subsystem for Linux) dan akan menginstall distro Linux Ubuntu.

4. Restart komputer kalian
5. Download [Installer Docker Desktop](https://docs.docker.com/desktop/release-notes/) dan sesuaikan dengan arsitektur komputer.
6. Jalankan installer.

### 3. [PostgreSQL](https://www.postgresql.org/)

PostgreSQL merupakan salah satu dari RDBMS SQL.

PostgreSQL cukup cepat dan fiturnya jauh lebih banyak dibanding RDBMS lainnya seperti [MySQL](https://www.mysql.com).

Kalian tidak perlu menginstall PostgreSQL, karena nanti akan diinstall di container menggunakan Docker Composer.

### 4. [Git](https://www.git-scm.com)

Anda seharusnya sudah memahami ini.

### 5. [BiomeJS](https://biomejs.dev)

BiomeJS merupakan salah satu formatter dan linter JS dan TS. Kalian mungkin sering menggunakan prettier dan eslint, kedua tools tersebut membantu ketika kita ngoding JS dan TS.

Prettier dapat merapihkan code yang kita tulis dengan sekali save, inilah yang disebut sebagai formatter.
Sementara ESLint dapat menjaga code kita dari bug dengan memberikan beberapa rules tambahan, inilah yang disebut sebagai linter.

Untuk menggunakan keduanya, kita perlu mengsetupnya di project kita (atau langsung melalui Code Editor yang kita gunakan).

Namun, selain menggunakan keduanya, kita dapat menggunakan 1 tools alternatif yang jauh lebih cepat dan sudah menampung keduanya, yaitu BiomeJS.

Untuk menggunakan BiomeJS di VSCode, berikut langkah - langkah nya:
1. Buka repositori berikut di VSCode kalian.
2. Pastikan kalian telah menginstall semua dependensi nya (Pastikan kalian telah melewati [bagian C nomor 1](#1-install-semua-dependensi-dan-package-dengan-bun-masukkan-perintah-berikut)).
3. Install extension "Biome" (Direkomendasikan untuk mendisable extension linter dan formatter yang lainnya).
4. Buka command palette (dengan menggunakan F1 atau Ctrl+Shift+P).
5. Jalankan perintah "Format Document With..."
6. Pilih "Configure Default Formatter..."
7. Pilih Biome.

## Langkah - langkah:

### A. Clone

#### 1. Buka CMD, PowerShell atau terminal lainnya.

#### 2. Masuk ke direktori dimana kalian ingin menyimpan repositori ini disimpan.

#### 3. Jalankan perintah berikut:

```bat
git clone https://github.com/ItsMalma/goumrah
```

#### 4. Masuk ke dalam folder repositori nya, jika kalian sebelumnya mengclone repositori nya sesuai dengan perintah di atas, maka masukkan perintah berikut:

```bat
cd goumrah
```

### B. Setup

#### 1. Install semua dependensi dan package dengan bun, masukkan perintah berikut:

```bat
bun install
```

#### 2. Ubah nama file `.env.example` menjadi `.env`, masukkan perintah berikut:

```bat
ren .env.example .env
```

#### 3. Buka file `.env` dan isi key yang sudah disediakan, berikut adalah tabel yang berisikan penjelasan tiap key:
   | **Key** | **Penjelasan** | **Contoh** |
   |-------------------|------------------------------------|------------|
   | POSTGRES_HOST | Host database yang akan dikoneksikan oleh aplikasi | localhost |
   | POSTGRES_PORT | Port database yang akan dikoneksikan oleh aplikasi | 5432 |
   | POSTGRES_PASS | Password untuk database PostgreSQL | sayatampan |
   | POSTGRES_USER | Username untuk database PostgreSQL | postgres |
   | POSTGRES_NAME | Nama database yang akan dipakai | goumrah |
   | PORT | Port dimana aplikasi (server) berjalan | 80 |
   | FILE_NAME_LENGTH | Panjang nama file yang akan digenerate oleh aplikasi (gambar, dkk) | 10 |

#### 4. Install semua tools yang sudah dituliskan di `docker-compose.yml` dengan menjalankan perintah berikut:

```bat
docker compose up -d
```

#### 5. Jalankan migrasi pada database dengan schema yang telah dibuat menggunakan TypeORM. Jalankan perintah berikut:
```bat
bun prisma db push
```

### C. Jalankan

#### 1. Jalankan perintah

```bat
bun run dev
```
