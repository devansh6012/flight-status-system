# Real-Time Flight Status and Notification System

## Overview
This project provides a comprehensive solution for delivering real-time flight status updates and notifications to passengers. The system displays current flight statuses, including delays, cancellations, and gate changes, and sends personalized notifications to users via push notifications.

Walkthrough Video: https://drive.google.com/file/d/1yCksjRiH_FqOOUb_BiKbZyQR6vzsdg2B/view?usp=sharing

## Features
- **Real-Time Updates:** Displays up-to-date flight status information on the frontend.
- **Push Notifications:** Sends notifications for flight status changes using Firebase Cloud Messaging (FCM).
- **User Management:** Allows users to register, subscribe to specific flights.

## Tech Stack

### Frontend
- **React.js:** For building a dynamic and responsive user interface.
- **Axios:** For making HTTP requests to the backend API.
- **Firebase Cloud Messaging (FCM):** For handling push notifications.
- **CSS:** For styling the components.

### Backend
- **Flask:** For creating a robust REST API.
- **MongoDB:** For storing flight data, user information, and subscription details.
- **PyMongo:** For interacting with the MongoDB database.
- **Firebase Admin SDK:** For sending notifications through FCM.


## Installation and Setup

1. **Clone the repository:**
    ```sh
    git clone https://github.com/devansh6012/flight-status-system.git
    cd flight-status-system
    ```

2. **Backend Setup:**
    - Enter inside Backend:
        ```sh
        cd backend
        ```
    - Install Python dependencies:
        ```sh
        pip install -r requirements.txt
        ```
    - Run Backend:
        ```sh
        python run.py
        ```

3. **Frontend Setup:**
    - Enter inside Frontend:
        ```sh
        cd frontend
        ```
    - Navigate to the frontend directory:
        ```sh
        cd frontend
        ```
    - Install Node.js dependencies:
        ```sh
        npm install
        ```
    - Start the React development server:
        ```sh
        npm start
        ```

## Usage
1. **Register and Subscribe:**
    - Users can register by entering their name and email, which generates a unique token for push notifications.
    - Users can subscribe to specific flights to receive updates.

2. **Flight Updates:**
    - Admins can update flight status, gate, and departure times through the backend.
    - Subscribed users receive notifications about these updates in real-time.

## Gallery

![image](https://github.com/user-attachments/assets/374d2512-8133-4728-9e8c-063542529633)
Admin Page



## Contributing
We welcome contributions to enhance this project. Please follow standard GitHub procedures for submitting pull requests and issues.

## License
This project is licensed under the MIT License.

## Acknowledgements
- **Firebase:** For providing the cloud messaging service.
- **React.js:** For the powerful frontend library.
- **Flask:** For the lightweight yet powerful web framework.
- **MongoDB:** For the flexible NoSQL database.

For any queries or issues, please contact [devansh5901@gmail.com](mailto:devansh5901@gmail.com).
