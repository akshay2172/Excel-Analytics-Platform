# 📊 Excel Analytics Platform

Excel Analytics Platform is a full-stack web application that allows users to upload Excel files and generate interactive 2D and 3D data visualizations. The platform is designed to help users quickly analyze spreadsheet data and gain insights through modern charts and dashboards.

The project is built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)** and supports secure authentication, Excel file parsing, and dynamic visualization.

---

## 🚀 Features

- 🔐 Secure user authentication using JWT
- 📂 Upload Excel files (`.xls`, `.xlsx`)
- 📄 Parse and read Excel sheet data
- 📊 Interactive 2D charts (bar, line, pie, etc.)
- 🌐 3D data visualizations
- 💻 Responsive and user-friendly UI
- ⚡ Fast data processing and rendering

---

## 🏗️ Tech Stack

### Frontend
- React.js
- React Router
- Chart.js / Recharts
- Three.js (for 3D visualizations)
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer (file upload)
- SheetJS (xlsx)
- JWT Authentication

---

## 📁 Project Structure

Excel-Analytics-Platform/
├── client/ # React frontend
│ ├── public/
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── App.jsx
│ └── index.js
│
├── server/ # Node.js backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── utils/
│ ├── server.js
│ └── package.json
│
├── .gitignore
└── README.md


## 🚀 Getting Started

### Prerequisites
*   [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine.
*   Alternatively, Node.js and npm if you wish to run the services natively.

### Installation & Running with Docker (Recommended)

The easiest way to run the entire platform is using the provided Docker setup.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/akshay2172/Excel-Analytics-Platform.git
    cd Excel-Analytics-Platform
    ```

2.  **Start the application**
    Launch both the frontend and backend services with one command.
    ```bash
    docker-compose up
    ```
    The containers will build (on first run) and start.

3.  **Access the application**
    Open your web browser and navigate to `http://localhost:3000` (or the port configured for the client). The backend API will typically be available on a separate port (e.g., `5000`).

4.  **To stop the application**
    Press `Ctrl+C` in the terminal where it's running, or run the following command in the project directory:
    ```bash
    docker-compose down
    ```

### Manual Setup (Without Docker)

If you prefer to run the services directly:

1.  **Backend Server**
    ```bash
    cd server
    npm install          # Install dependencies
    npm start            # Start the server
    ```

2.  **Frontend Client**
    ```bash
    cd client
    npm install          # Install dependencies
    npm start            # Start the development server
    ```
    You will need to configure the API endpoint in the client to connect to your running backend server.

## 📈 How to Use

1.  **Upload Data**: On the main page, use the file uploader to select your Excel or CSV file.
2.  **Select Data & Chart Type**: Choose the columns you want to visualize and select your preferred chart type (2D or 3D).
3.  **Customize & Render**: Adjust chart parameters like titles, colors, and axes, then generate the visualization.
4.  **Interact & Export**: Hover over chart elements for details, zoom/rotate 3D charts, and export your final visualization as an image.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

Please ensure your code adheres to the existing style for consistency.

## 👤 Author

**Akshay**
*   GitHub: [@akshay2172](https://github.com/akshay2172)

## 🙏 Acknowledgments

*   Thanks to all contributors and users of this project.
*   Inspiration from various data visualization libraries and tools.

---
*If you like this project, please consider giving it a ⭐ on GitHub!*
