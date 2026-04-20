# 💰 Amount Distribution Simulator

A modern, attractive, and fully responsive React application for simulating amount distribution across numbered boxes and generating randomized distribution folders.

## 🌟 Features

- **Interactive 10×10 Box Grid**: Visual representation of 100 numbered boxes (1-100)
- **Amount Assignment**: Assign amounts to multiple boxes simultaneously
- **Real-time Statistics**: Track selected boxes and total amount stored
- **Random Distribution Generator**: Generate multiple folders with randomized amount distributions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Beautiful UI**: Modern gradient design with smooth animations and transitions
- **JSON Export**: Download distribution results as JSON for further analysis
- **Reset Functionality**: Clear all data and start fresh

## 📋 Requirements

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone or Download the Project

```bash
git clone <repository-url>
cd amount-distribution-simulator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5174/`

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## 🎯 How to Use

### Step 1: Assign Amounts to Boxes

1. Enter an amount in the **"Enter Amount"** field (e.g., 10000)
2. Enter box numbers in the **"Enter Box Numbers"** field, separated by commas (e.g., 9,10,18,19,27)
3. Click **"Assign Amount"** button
4. Watch the boxes highlight and display the assigned amounts

### Step 2: Monitor Statistics

- **Selected Boxes**: Count of boxes with assigned amounts
- **Total Amount**: Sum of all amounts across selected boxes

### Step 3: Generate Distributions

1. Enter the **"Number of Folders"** (e.g., 200)
2. Click **"Generate Distribution"** button
3. The system will create random distributions of ₹10,000 across your selected boxes

### Step 4: View & Export Results

- Scroll through the generated folders to see the allocations
- Click **"Download Results"** to export all data as JSON
- Use **"Reset All"** to clear everything and start over

## 🎨 Design Features

- **Modern Gradient Background**: Purple gradient theme
- **Smooth Animations**: All transitions and interactions are animated
- **Color-coded Elements**: Visual hierarchy with consistent color scheme
- **Responsive Grid**: Auto-adjusts from 10 columns (desktop) to 5 columns (mobile)
- **Accessible**: Proper contrast ratios and keyboard navigation support

## 📊 Distribution Logic

Each generated folder:

- Contains exactly ₹10,000
- Randomly distributes the amount across your selected boxes
- Can have multiple allocations to the same box across different folders
- Uses mathematical random distribution for realistic variation

### Example:

```
Folder 1
  Box 9 → ₹500
  Box 11 → ₹9500

Folder 2
  Box 18 → ₹3000
  Box 27 → ₹7000

Folder 3
  Box 10 → ₹1200
  Box 19 → ₹8800
```

## 🌐 Deploy to Production

### Option 1: Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist/` folder to [Netlify](https://app.netlify.com)
3. Your app will be live instantly!

### Option 2: Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Option 3: Deploy to GitHub Pages

1. Update `vite.config.js`:

```javascript
export default defineConfig({
  base: "/amount-distribution-simulator/",
  plugins: [react()],
});
```

2. Deploy:

```bash
npm run build
# Push dist folder to gh-pages branch
```

### Option 4: Self-Hosted

1. Build the project: `npm run build`
2. Upload the `dist/` folder contents to your web server
3. Configure your server to serve `index.html` for all routes

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ Technology Stack

- **React 19**: Modern UI library
- **Vite 8**: Lightning-fast build tool
- **CSS3**: Custom styling with CSS variables and Grid/Flexbox
- **JavaScript ES6+**: Modern JavaScript features

## 📁 Project Structure

```
amount-distribution-simulator/
├── src/
│   ├── components/
│   │   ├── AmountDistributionSimulator.jsx  (Main component)
│   │   ├── InputSection.jsx                  (Input controls)
│   │   ├── BoxGrid.jsx                       (Box grid display)
│   │   └── ResultsPanel.jsx                  (Results display)
│   ├── styles/
│   │   ├── AmountDistributionSimulator.css   (Main styles)
│   │   ├── InputSection.css                  (Input section styles)
│   │   ├── BoxGrid.css                       (Box grid styles)
│   │   └── ResultsPanel.css                  (Results styles)
│   ├── App.jsx                               (Main App)
│   ├── App.css                               (App styles)
│   ├── index.css                             (Global styles)
│   └── main.jsx                              (Entry point)
├── dist/                                      (Production build)
├── public/                                    (Static assets)
├── package.json
├── vite.config.js
└── index.html
```

## 🎓 Code Explanation

### Main Component Logic

The `AmountDistributionSimulator` component manages:

- **State Management**: Boxes array, distributions array, and number of folders
- **Amount Assignment**: Validates input and assigns amounts to selected boxes
- **Distribution Generation**: Creates random distributions totaling ₹10,000 per folder
- **Download Functionality**: Exports data in JSON format

### Distribution Algorithm

```javascript
for (let folder = 0; folder < numFolders; folder++) {
  let remainingAmount = 10000;

  // Randomly distribute across valid boxes
  for (let i = 0; i < validBoxNumbers.length - 1; i++) {
    const randomAmount = Math.random() * (remainingAmount - 1) + 1;
    distribution[box] = randomAmount;
    remainingAmount -= randomAmount;
  }

  // Assign remainder to last box
  distribution[lastBox] = remainingAmount;
}
```

## 🔧 Customization

### Change Colors

Edit CSS variables in `AmountDistributionSimulator.css`:

```css
:root {
  --primary-color: #6366f1; /* Change primary color */
  --secondary-color: #10b981; /* Change secondary color */
  --danger-color: #ef4444; /* Change danger color */
  /* ... other colors ... */
}
```

### Change Base Amount for Distribution

In `AmountDistributionSimulator.jsx`, modify:

```javascript
const baseAmount = 10000; // Change this value
```

### Modify Grid Size

In `BoxGrid.jsx`, change the number of boxes:

```javascript
const [boxes, setBoxes] = useState(new Array(100).fill(null)); // Change 100
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill the process on port 5174
lsof -ti:5174 | xargs kill -9
npm run dev
```

### Dependencies Not Installing

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Fails

```bash
npm cache clean --force
npm install
npm run build
```

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📧 Support

For issues or questions, please open an issue on GitHub or contact the maintainer.

## 🎉 Version History

### v1.0.0 (Current)

- Initial release with all core features
- Modern React implementation
- Full responsive design
- JSON export functionality

---

**Made with ❤️ using React & Vite**
