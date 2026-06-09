# <img src="build/logo.png" width="60" align="center" /> Umay

<div align="center">
  <strong>AI-Powered Note Manager</strong> | <strong>Yapay Zeka Destekli Not Yöneticisi</strong>
  <br><br>
  <img src="https://img.shields.io/badge/Electron-33.2-blue?style=flat&logo=electron" />
  <img src="https://img.shields.io/badge/React-18.3-blue?style=flat&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-blue?style=flat&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat" />
  <br><br>
  <img src="https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey?style=flat" />
  <br><br>
  <img src="https://img.shields.io/badge/Features-30%2B-orange?style=flat" />
</div>

---

<details open>
<summary><h2>🇬🇧 English</h2></summary>

## 🚀 What is Umay?

**Umay** is a fully local, AI-readable note-taking application designed for developers and thinkers. Unlike cloud-based solutions, your data stays exclusively on your device (stored in `~/Documents/AI-Notes/notes.json`).

### ✨ Key Features

#### 📝 Note Management
- **Multiple Note Types**: Notes, Tasks, and Ideas
- **Projects**: Organize your thoughts into project-based collections
- **Tags & Labels**: Powerful tagging system with tag cloud visualization
- **Pin & Star**: Mark important notes for quick access
- **Kanban Board**: Drag-and-drop task management
- **Search**: Lightning-fast ⌘K search across all notes

#### 🤖 AI Integration
- **AI Export**: Generate structured AI prompts from your projects for ChatGPT, Claude, or any LLM
- **Smart Tags**: Auto-suggested tags based on content
- **Related Notes**: Intelligent content-based note linking
- **Note Summaries**: AI-generated note summaries

#### ⚡ Productivity Features
- **Keyboard Shortcuts**: ⌘K (Search), ⌘N (Quick Note), ⌘E (AI Export), ⌘D (Daily Notes), ⌘F (Focus Mode)
- **Focus Mode**: Distraction-free writing environment
- **Split View**: Side-by-side note editing
- **Daily Notes**: Daily journaling with automatic date tracking
- **Word Count**: Real-time word and character statistics
- **Reading Time**: Estimated reading time for each note

#### 🔄 Advanced Features
- **Note History**: Version tracking for all your edits
- **Backlinks**: See which notes reference each other
- **Attachments**: File attachment support for notes
- **Reminders**: Due date reminders for tasks
- **Archive**: Archive old projects without losing them
- **Trash**: Soft-delete with recovery option
- **Smart Folders**: Dynamic filtering based on criteria
- **Batch Operations**: Multi-select and bulk actions
- **Statistics Dashboard**: Visual analytics of your notes
- **Export**: Markdown, JSON, and AI prompt export
- **Dark Mode**: Full dark theme support

### 🖼️ Screenshots

<div align="center">
  <img src="https://raw.githubusercontent.com/nickzsche/Umay/main/screenshots/main-view.png" width="80%" alt="Main View" />
  <br><sub><i>Main Project View with Grid Layout</i></sub>
  <br><br>
  <img src="https://raw.githubusercontent.com/nickzsche/Umay/main/screenshots/project-detail.png" width="80%" alt="Project Detail" />
  <br><sub><i>Project Detail View with Note Editor</i></sub>
  <br><br>
  <img src="https://raw.githubusercontent.com/nickzsche/Umay/main/screenshots/ai-export.png" width="60%" alt="AI Export" />
  <br><sub><i>AI Export - Generate structured prompts for LLMs</i></sub>
  <br><br>
  <img src="https://raw.githubusercontent.com/nickzsche/Umay/main/screenshots/kanban-board.png" width="80%" alt="Kanban Board" />
  <br><sub><i>Kanban Board - Drag & Drop Task Management</i></sub>
  <br><br>
  <img src="https://raw.githubusercontent.com/nickzsche/Umay/main/screenshots/dark-mode.png" width="60%" alt="Dark Mode" />
  <br><sub><i>Dark Mode - Easy on the eyes</i></sub>
</div>

### 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/nickzsche/Umay.git
cd Umay

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the application
npm run build
```

### 📦 Download

Pre-built binaries are available in the [Releases](https://github.com/nickzsche/Umay/releases) section.

### 🎯 Use Cases

- **Project Documentation**: Document APIs, architecture decisions, and bug reports
- **Knowledge Management**: Build a personal knowledge base with interconnected notes
- **Task Management**: Track todos and project milestones with Kanban
- **AI Context Preparation**: Export project context as structured prompts for AI assistants
- **Daily Journaling**: Daily notes with automatic date tracking
- **Learning Notes**: Organize learning materials with tags and links

### 🛡️ Privacy

- **100% Local**: All data stored in `~/Documents/AI-Notes/notes.json`
- **No Cloud**: No internet connection required, no external servers
- **Your Data**: You own and control everything

### 🏗️ Tech Stack

- **Electron**: Cross-platform desktop framework
- **React 18**: UI library with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool
- **Lucide React**: Beautiful icons

### 📝 License

MIT License - See [LICENSE](LICENSE) for details.

</details>

---

<details>
<summary><h2>🇹🇷 Türkçe</h2></summary>

## 🚀 Umay Nedir?

**Umay**, geliştiriciler ve düşünürler için tasarlanmış, tamamen yerel (local) çalışan, yapay zeka ile uyumlu bir not tutma uygulamasıdır. Bulut tabanlı çözümlerin aksine, verileriniz tamamen cihazınızda kalır (`~/Documents/AI-Notes/notes.json` içinde saklanır).

### ✨ Temel Özellikler

#### 📝 Not Yönetimi
- **Çoklu Not Türleri**: Notlar, Görevler ve Fikirler
- **Projeler**: Düşüncelerinizi proje bazlı koleksiyonlarda organize edin
- **Etiketler**: Etiket bulutu görselleştirmesi ile güçlü etiket sistemi
- **Pin & Star**: Önemli notları hızlı erişim için işaretleyin
- **Kanban Panosu**: Sürükle-bırak görev yönetimi
- **Arama**: Tüm notlarda yıldırım hızında ⌘K arama

#### 🤖 Yapay Zeka Entegrasyonu
- **AI Export**: Projelerinizden ChatGPT, Claude veya herhangi bir LLM için yapılandırılmış AI prompt'ları oluşturun
- **Akıllı Etiketler**: İçeriğe dayalı otomatik etiket önerileri
- **İlişkili Notlar**: İçerik bazlı akıllı not bağlantıları
- **Not Özetleri**: AI tarafından oluşturulan not özetleri

#### ⚡ Verimlilik Özellikleri
- **Klavye Kısayolları**: ⌘K (Arama), ⌘N (Hızlı Not), ⌘E (AI Export), ⌘D (Günlük Notlar), ⌘F (Odak Modu)
- **Odak Modu**: Dikkat dağıtıcı unsurlardan arındırılmış yazma ortamı
- **Bölünmüş Görünüm**: Yan yana not düzenleme
- **Günlük Notlar**: Otomatik tarih takibi ile günlük tutma
- **Kelime Sayısı**: Gerçek zamanlı kelime ve karakter istatistikleri
- **Okuma Süresi**: Her not için tahmini okuma süresi

#### 🔄 Gelişmiş Özellikler
- **Not Geçmişi**: Tüm düzenlemeleriniz için versiyon takibi
- **Geri Bağlantılar**: Hangi notların birbirine referans verdiğini görün
- **Ekler**: Notlar için dosya eki desteği
- **Hatırlatıcılar**: Görevler için son tarih hatırlatıcıları
- **Arşiv**: Eski projeleri kaybetmeden arşivleyin
- **Çöp Kutusu**: Kurtarma seçeneği ile yumuşak silme
- **Akıllı Klasörler**: Kriter bazlı dinamik filtreleme
- **Toplu İşlemler**: Çoklu seçim ve toplu eylemler
- **İstatistik Dashboard**: Notlarınızın görsel analitiği
- **Dışa Aktarma**: Markdown, JSON ve AI prompt export
- **Karanlık Mod**: Tam karanlık tema desteği

### 🖼️ Ekran Görüntüleri

<div align="center">
  <img src="https://raw.githubusercontent.com/nickzsche/Umay/main/screenshots/main-view.png" width="80%" alt="Ana Görünüm" />
  <br><sub><i>Ana Proje Görünümü - Grid Düzeni</i></sub>
  <br><br>
  <img src="https://raw.githubusercontent.com/nickzsche/Umay/main/screenshots/project-detail.png" width="80%" alt="Proje Detayı" />
  <br><sub><i>Proje Detay Görünümü - Not Editörü</i></sub>
  <br><br>
  <img src="https://raw.githubusercontent.com/nickzsche/Umay/main/screenshots/ai-export.png" width="60%" alt="AI Export" />
  <br><sub><i>AI Export - LLM'ler için yapılandırılmış prompt'lar oluşturun</i></sub>
  <br><br>
  <img src="https://raw.githubusercontent.com/nickzsche/Umay/main/screenshots/kanban-board.png" width="80%" alt="Kanban Panosu" />
  <br><sub><i>Kanban Panosu - Sürükle Bırak Görev Yönetimi</i></sub>
  <br><br>
  <img src="https://raw.githubusercontent.com/nickzsche/Umay/main/screenshots/dark-mode.png" width="60%" alt="Karanlık Mod" />
  <br><sub><i>Karanlık Mod - Göz Yorulmasını Önler</i></sub>
</div>

### 🛠️ Kurulum

```bash
# Repoyu klonlayın
git clone https://github.com/nickzsche/Umay.git
cd Umay

# Bağımlılıkları yükleyin
npm install

# Geliştirme modunda çalıştırın
npm run dev

# Uygulamayı derleyin
npm run build
```

### 📦 İndirme

Önceden derlenmiş uygulama dosyaları [Releases](https://github.com/nickzsche/Umay/releases) bölümünde mevcuttur.

### 🎯 Kullanım Alanları

- **Proje Dokümantasyonu**: API'leri, mimari kararları ve hata raporlarını dokümante edin
- **Bilgi Yönetimi**: Birbirine bağlı notlar ile kişisel bilgi tabanı oluşturun
- **Görev Yönetimi**: Kanban ile todo'ları ve proje kilometre taşlarını takip edin
- **AI Bağlam Hazırlama**: Projelerinizi yapılandırılmış prompt'lar olarak AI asistanlarına export edin
- **Günlük Tutma**: Otomatik tarih takibi ile günlük notlar
- **Öğrenme Notları**: Etiketler ve bağlantılar ile öğrenme materyallerini organize edin

### 🛡️ Gizlilik

- **%100 Yerel**: Tüm veriler `~/Documents/AI-Notes/notes.json` içinde saklanır
- **Bulut Yok**: İnternet bağlantısı gerekmez, harici sunucu yok
- **Veriniz Sizin**: Her şeyi siz sahiplenir ve kontrol edersiniz

### 🏗️ Teknoloji Yığını

- **Electron**: Çapraz platform masaüstü framework'ü
- **React 18**: Hook'lar ile UI kütüphanesi
- **TypeScript**: Tip güvenli geliştirme
- **Tailwind CSS**: Utility-first stil
- **Vite**: Hızlı build aracı
- **Lucide React**: Güzel ikonlar

### 📝 Lisans

MIT Lisans - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

</details>

---

<div align="center">
  <br>
  <strong>Made with ❤️ for developers and thinkers</strong>
  <br>
  <sub>Geliştiriciler ve düşünürler için ❤️ ile yapıldı</sub>
  <br><br>
  <a href="https://github.com/nickzsche/Umay/stargazers">⭐ Star</a> • 
  <a href="https://github.com/nickzsche/Umay/issues">🐛 Report Bug</a> • 
  <a href="https://github.com/nickzsche/Umay/issues">💡 Feature Request</a>
</div>
