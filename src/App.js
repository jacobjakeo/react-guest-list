import React, { useEffect, useState } from 'react';
import styles from './App.module.scss';

const GuestListApp = () => {
  const [guests, setGuests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);

  // Event handlers for input changes
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  // Event handler for Enter key press in the last name input field
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addGuest();
    }
  };

  const addGuest = async () => {
    // Create a new guest object with the first name, last name, and default attending status
    const newGuest = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      attending: false,
    };

    try {
      const response = await fetch('http://localhost:4000/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGuest),
      });

      if (response.ok) {
        // Guest successfully added, clear the input fields
        setFirstName('');
        setLastName('');

        // Reload the guest list from the API
        loadGuestList();
      } else {
        throw new Error('Failed to add guest');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadGuestList = async () => {
    try {
      const response = await fetch('http://localhost:4000/guests');
      const data = await response.json();
      setGuests(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuestList();
  }, []);

  // Step 5: Remove a guest from the guest list
  const removeGuest = (guest) => {
    setGuests(guests.filter((g) => g !== guest));
  };

  // Step 6: Toggle attending status of a guest
  const toggleAttending = async (guest) => {
    const updatedGuest = { ...guest, attending: !guest.attending };

    try {
      const response = await fetch(`http://localhost:4000/guests/${guest.id}`, {
        method: 'PUT', // or 'PATCH' depending on your server's API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGuest),
      });

      if (response.ok) {
        setGuests(
          guests.map((g) => {
            if (g === guest) {
              return { ...g, attending: !g.attending };
            }
            return g;
          }),
        );
      } else {
        throw new Error('Failed to update attending status');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const attendingGuests = guests.filter((guest) => guest.attending);
  const notAttendingGuests = guests.filter((guest) => !guest.attending);

  return (
    <div className={styles.MainPage}>
      <h1 className={styles.Title}>Guest List</h1>
      <div className={styles.Container}>
        <div className={styles.EditContainer}>
          {/* Step 7: First name input */}
          <label htmlFor="firstName" className={styles.List}>
            First name
          </label>
          <br />
          <input
            id="firstName"
            value={firstName}
            onChange={handleFirstNameChange}
          />
          {/* Step 8: Last name input */}
          <label htmlFor="lastName" className={styles.List}>
            Last name
          </label>
          <br />
          <input
            id="lastName"
            value={lastName}
            onChange={handleLastNameChange}
            onKeyPress={handleKeyPress}
          />
          {/* Add Guest button */}
          <button onClick={addGuest}>
            <b>Add Guest</b>
          </button>
        </div>
      </div>
      <div className={styles.GuestContainer}>
        <div className={styles.GuestContainerCard}>
          <ul className={styles.GuestList}>
            {/* Render guest list */}
            {guests.map((guest, index) => (
              <div key={index} data-test-id="guest">
                <li className={styles.GuestListName}>
                  {guest.firstName} {guest.lastName}
                </li>
                <br />
                <label className={styles.GuestList}>
                  <input
                    className={styles.GuestList}
                    type="checkbox"
                    checked={guest.attending}
                    onChange={() => toggleAttending(guest)}
                    aria-label={`${guest.firstName} ${guest.lastName} attending status`}
                  />
                  Attending
                </label>
                <button
                  aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                  onClick={() => removeGuest(guest)}
                >
                  <b>Remove</b>
                </button>
              </div>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.AttendingContainer}>
        <div className={styles.AttendingContainerCard}>
          <h2>Attending Guests</h2>
          <ul className={styles.AttendingList}>
            {attendingGuests.map((guest, index) => (
              <div key={index} data-test-id="guest">
                <li className={styles.AttendingName}>
                  {guest.firstName} {guest.lastName}
                </li>
              </div>
            ))}
          </ul>
        </div>
        <div className={styles.NotAttendingContainerCard}>
          <h2>Not Attending Guests</h2>
          <ul className={styles.NotAttendingList}>
            {notAttendingGuests.map((guest, index) => (
              <div key={index} data-test-id="guest">
                <li className={styles.NotAttendingName}>
                  {guest.firstName} {guest.lastName}
                </li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GuestListApp;
