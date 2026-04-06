# 🚀 Rahul Mahata - Comprehensive Developer Portfolio

Welcome to the official repository of **Rahul Mahata's Professional Portfolio**. This project is a modern, high-performance, and feature-rich personal website designed for developers, students, and tech enthusiasts. It showcases my journey as an MCA student and Aspiring Software Engineer.

---

## 🌟 Key Features & Highlights

This portfolio isn't just a static page; it's a dynamic digital experience packed with modern web features:

- 🎨 **Premium Aesthetics**: Sleek dark-mode design with glassmorphism, smooth gradients, and vibrant accents.
- 🎭 **Dynamic Animations**: 
    - **AOS (Animate On Scroll)** for reveal effects.
    - **Interactive Typing Effect** in the hero section.
    - **Particles background** for a tech-focused atmosphere.
    - **Custom Cursor** that reacts to interactive elements.
- 📱 **100% Responsive Design**: Flawless experience across mobile, tablet, and desktop devices.
- 🌓 **Theme Toggle**: Switch between Dark and Light modes with persistent local storage.
- 📊 **Filterable Project Showcase**: Categorized gallery (Web, Mobile, UI/UX) with smooth transitions.
- 📧 **Interactive Contact Form**: Real-time validation and simulated submission with feedback.
- 🎓 **Education Timeline**: A visually compelling way to display academic milestones.
- 💼 **Professional CV/Resume**: 
    - **View Portfolio CV**: A dedicated, modern HTML resume (`files/resume.html`).
    - **Download CV**: Direct link to your professional PDF (`files/resume.pdf`).
- 🔍 **SEO & Accessibility**: Semantic HTML5 and meta tags for optimal search engine performance.

---

## 🛠️ Tech Stack & Dependencies

Built using the "Holy Trinity" of web development with modern enhancements:

- **HTML5**: Semantic structure for better SEO and accessibility.
- **CSS3 (Vanilla)**: Custom properties (variables), Flexbox, Grid, and complex Keyframe animations.
- **JavaScript (ES6+)**: Modular vanilla JS for all interactivity (no heavy frameworks needed!).
- **[AOS Library](https://michalsnik.github.io/aos/)**: For industry-standard scroll animations.
- **[Font Awesome 6.4+](https://fontawesome.com/)**: For high-quality vector icons.
- **[Google Fonts](https://fonts.google.com/)**: Uses 'Poppins' and 'Orbitron' for a futuristic yet readable typography.

---

## 📁 Project Structure (The Architecture)

Understanding the folder structure is key to modifying the project:

```text
/WEBSITE
│
├── 📂 css/
│   └── style.css          # Core design system, animations, and responsive rules (1700+ lines)
│
├── 📂 js/
│   └── script.js         # Navigation, Typing, Theme Toggle, Particles, and Form Logic
│
├── 📂 images/
│   └── profile.jpg        # Your main profile image (Recommended: Square 1:1 ratio)
│
├── 📂 files/
│   ├── resume.html        # Modern, printable HTML-based CV
│   └── resume.pdf         # Downloadable PDF version of your resume
│
├── index.html             # Main entry point and structural backbone
└── readme.md              # Detailed documentation (You are here!)
```

---

## 🚀 Getting Started & Setup

### 1. Requirements
You don't need much! Just a modern web browser (Chrome, Firefox, Edge, etc.) and a code editor like VS Code.

### 2. Live Preview
Simply open `index.html` in your browser. No server setup is required, though using a "Live Server" extension in VS Code is recommended for real-time development.

### 3. Deploying to the Web
This is a static site, meaning you can host it for **FREE** on:
- **GitHub Pages**
- **Netlify**
- **Vercel**

---

## 🛠️ How to Customize (Beginner Guide)

### 1. Update Your Name & Info
Open `index.html` and search for "Rahul Mahata". Replace it with your name. Do the same for the email (`rahulmahata3460@gmail.com`).

### 2. Change Profile Picture
Replace `images/profile.jpg` with your own photo. The CSS is already configured to make it look circular and add professional glows!

### 3. Add New Projects
Find the `<!-- Project 1 -->` comment in `index.html`. Copy an existing project card and update the `img`, `title`, and `description`. Ensure the `data-category` match (web, mobile, or ui).

### 4. Personalize Social Links
Update the `href="https://github.com/Rahul3460"` links with your own social media URLs.

---

## 🤖 Tips for AI & AI-IDE Users

If you are using an AI assistant (like Cursor, Windsurf, or Antigravity) to help you:
- **Styling**: All design tokens are in `:root` inside `style.css`. Change these to instantly rebrand the whole site.
- **Logic**: All major features are initialized in `document.addEventListener('DOMContentLoaded', ...)` in `script.js`.
- **CV**: The `resume.html` file is designed to be printed. Open it, press `Ctrl+P`, and save as PDF for a perfect physical resume.

---

## 📜 License
This project is for personal showcase. Feel free to use it as a template for your own portfolio!

**Developed with ❤️ by Rahul Mahata**