"use client"; // This makes the component a Client Component

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from '../app/nav.module.css';
import Logo from '../../public/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app/globals.css';

const notifyUser = (command) => {
  alert(`Command ${command} sent to the board successfully.`);
};

const updateLEDStatus = async (command, setStatus) => {
  try {
    const response = await fetch('/api/getControlCommand', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    const data = await response.json();
    console.log('Response Data:', data);  // ตรวจสอบข้อมูลที่ได้รับ

    if (data.success) {
      setStatus(command !== 'OFF'); // Update the status based on the command
      notifyUser(command); // Notify the user of the successful command
    } else {
      alert('Failed to update Command');
    }
  } catch (error) {
    console.error('Error updating Command:', error);
    alert('Failed to send command to the board.');
  }
};

const fetchLEDStatus = async (setStatus) => {
  try {
    const response = await fetch('/api/getCurrentStatus', {
      method: 'GET',
    });

    const data = await response.json();

    if (data.success) {
      setStatus(data.isOn); // Assume the response has an `isOn` boolean property
    }
  } catch (error) {
    console.error('Error fetching current status:', error);
  }
};

const Navbar = () => {
  const [ledStatus, setLEDStatus] = useState(false);

  useEffect(() => {
    // Fetch the current LED status when the component loads
    fetchLEDStatus(setLEDStatus);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbarCustom}`}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" href="./">
          <span className={styles.navbarBrandText}>My Gu</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
  <ul className="navbar-nav d-flex align-items-center ">
    <li className="nav-item">
    <button type="button" className={`btn ${styles.btnCustom} me-2`} onClick={() => updateLEDStatus('RGB_ON', setLEDStatus)}></button>
    <button type="button" className={`btn ${styles.btnCustom} me-2`} onClick={() => updateLEDStatus('RGB_ON', setLEDStatus)}></button>
    <button type="button" className={`btn ${styles.btnCustom} me-2`} onClick={() => updateLEDStatus('RGB_ON', setLEDStatus)}></button>
    <button type="button" className={`btn ${styles.btnCustom} me-2`} onClick={() => updateLEDStatus('RGB_ON', setLEDStatus)}></button>
      <Link className={`nav-link ${styles.navLink}`} href="/History"></Link>
    </li>
  </ul>
  <form className="me-auto ms-auto mb-5 mb-lg-0">
    <button type="button" className={`btn ${styles.btnCustom} me-2`} onClick={() => updateLEDStatus('RGB_ON', setLEDStatus)}>OPEN RGB</button>
    <button type="button" className={`btn ${styles.btnwarning} me-2`} onClick={() => updateLEDStatus('BUZZER_ON', setLEDStatus)}>BUZZER</button>
    <button type="button" className={`btn ${styles.btnDanger}`} onClick={() => updateLEDStatus('OFF', setLEDStatus)}>OFF</button>
    
  </form>
  <ul className="navbar-nav d-flex align-items-center ">
  <span className={`ms-3 ${ledStatus ? styles.statusOn : styles.statusOff}`}>
      {ledStatus ? 'LED is ON' : 'LED is OFF'}
    </span>
    <li className="nav-item">
      <Link className={`nav-link ${styles.navLink} me-2`} href="/History"></Link>
    </li>
    <li className="nav-item">
      <Link className={`nav-link ${styles.navLink} me-2`} href="/History">History</Link>
    </li>
    
 
  </ul>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
