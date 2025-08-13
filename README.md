# 🐞 Bug Tracking System

A **role-based bug tracking platform** designed for streamlined project and issue management.  
Built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**, it provides **robust authentication**, **user access control**, and **media handling** for project and bug management.

---
## 🚀 Features

### 🔐 Authentication & Authorization
- Secure **JWT-based authentication**.
- **Role-based access control** using custom middleware.
- User roles:
  - **Admin**
  - **Manager**
  - **QA**
  - **Developer**
- Users can:
  - Register with **name, email, password, and user type**.
  - Login & receive a JWT token.
  - Logout securely.
<img width="400" height="600" alt="image" src="https://github.com/user-attachments/assets/77a1aa09-eefd-42e7-827d-06e7df8abff0" />
<img width="400" height="600" alt="image" src="https://github.com/user-attachments/assets/79d2d531-d68c-4b7d-a3b8-0fb8846022ff" />


---

### 👤Admin
- Create new users (any role: Manager, QA, Developer, Admin)
- View all users in the system
- Create new projects
- View all projects
- Create bugs for any project
- View all bugs across all projects

<img width="1332" height="637" alt="image" src="https://github.com/user-attachments/assets/eb840394-e38e-465b-a035-bd76ee11d709" />



<img width="1322" height="633" alt="image" src="https://github.com/user-attachments/assets/933fb3d1-77ef-44ab-a940-f906b60da867" />
<img width="587" height="547" alt="image" src="https://github.com/user-attachments/assets/27c5b9a6-db86-4b93-a770-a79eae64221c" />
<img width="1332" height="625" alt="image" src="https://github.com/user-attachments/assets/cbefcf54-59b3-414e-a1b6-dfbec7e14770" />
<img width="585" height="611" alt="image" src="https://github.com/user-attachments/assets/8fcec40d-31fb-4e3d-8aa5-6894826e6192" />
<img width="1334" height="595" alt="image" src="https://github.com/user-attachments/assets/caa3ffef-688f-4365-b920-2ac7b30ae008" />
<img width="489" height="643" alt="image" src="https://github.com/user-attachments/assets/7b18c2b4-f0ef-412e-8f72-aa5e58ec0d67" />


---


### 📂 Project Management (Manager Role)
- Create, edit, and delete projects.
- Assign **multiple QAs and Developers** to each project.
- View all bugs associated with managed projects.

<img width="1334" height="625" alt="image" src="https://github.com/user-attachments/assets/5ec2f765-abd5-4e41-b2fd-78485d3ee816" />


---
### 🐛 Bug Management
#### QA Users:
- Access **only assigned projects**.
- Create, view, edit, and delete bugs in their projects.

<img width="1319" height="636" alt="image" src="https://github.com/user-attachments/assets/e6fdf4da-28dd-4c87-a89a-b74dc506061c" />

<img width="1325" height="631" alt="image" src="https://github.com/user-attachments/assets/729adda5-9c8c-448b-8d9b-6457e12b6f2b" />
<img width="631" height="609" alt="image" src="https://github.com/user-attachments/assets/bc771491-6d65-408e-915f-9228a400a377" />

---

### 👨‍💻 Developer Users:
- View **assigned bugs** and projects.
- Update the **status** of bugs assigned to them.

<img width="1332" height="622" alt="image" src="https://github.com/user-attachments/assets/b110fcd7-9c8b-4697-84c7-42d8d82b805d" />
<img width="1349" height="629" alt="image" src="https://github.com/user-attachments/assets/7aaf4f4b-da90-4263-8ca7-d51bfc0575cb" />


---

### 📝 Bug Details
- **title** _(required, unique per project)_
- **description** _(optional)_
- **deadline** _(optional)_
- **screenshot** _(optional, only `.png` & `.gif` supported)_
- **type**: `feature` or `bug` _(required)_
- **status** _(required)_:
  - If **type = feature** → `new`, `started`, `completed`
  - If **type = bug** → `new`, `started`, `resolved`

---

## 🛠 Tech Stack

### **Frontend**
- React.js  
- React Router  
- Axios  
- Formik _(form state management)_  
- Yup _(form validation)_  

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  

### **Authentication**
- JWT _(JSON Web Tokens)_  
- Custom middleware for role-based access control  

### **File Uploads**
- Multer _(with validation for `.png` and `.gif` only)_

---


## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/bug-tracking-system.git
cd bug-tracking-system

