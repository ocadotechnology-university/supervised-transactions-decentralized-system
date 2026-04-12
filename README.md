# Decentralized and Supervised Event Transaction System

## Overview

This project is a mobile-first web application that enables distribution of virtual points between registered **Customers** using digital signatures, without a centralized settlement system.

**Traders** chosen by the **Supervisor** sign allocated funds using their cryptographic private keys. **Customers** can later present these funds to the **Supervisor** and verify them. This ensures transparency, integrity, and decentralization of transactions.

---

## Getting Started

### 1. Clone the repository

    git clone https://github.com/ocadotechnology-university/supervised-transactions-decentralized-system  
    cd supervised-transactions-decentralized-system





### 2. Install dependencies

Make sure Node.js LTS is installed.

    npm install



### 3. Run the server

    npm run dev

---

## Tech Stack

- React
- TypeScript
- Vite
- Node.js

---

## Project Structure

/src  -  Application source code  
/public  -  Static assets  
/docs  -  Documentation regarding this project    
/index.html  -  Vite entry point  
/vite.config.ts  -  Vite configuration

---

## Security Concept

The system uses digital signatures from authorized **Traders**. Each transaction is verified cryptographically, ensuring:

- No forgery of points
- No post-issuance modification
- Only authorized issuance

