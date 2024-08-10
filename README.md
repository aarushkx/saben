# Saben

Saben is a question and answer platform. The website is built using the MERN stack (MongoDB, Express, React, NodeJS).

# Project Features and Planning

## Features

### User Authentication and Management

- **Sign In/Log In**:
  - Users must be able to sign in and log in.
  - User details to be stored: name, username, email, password, age, avatar (character limit to be defined later).
  
- **Profile Management**:
  - Users can view their profile details and see all questions they have raised on their profile page.
  - Editing profile information: To be implemented in a later phase.

- **Logout**:
  - The logout route will prompt the user for confirmation before logging out.

### Question Management

- **Create a Question**:
  - Logged-in users can create new questions.
  - Character limit for questions: 400 characters (subject to adjustment).

- **Question Page**:
  - Clicking on a question will direct the user to the question page.
  - The question page will display the question along with all replies.
  
- **View Questions**:
  - Users can view all questions on the home page.
  - Clicking on a question will navigate to the respective question page.

- **Search Functionality**:
  - Users can search for questions and view relevant search results on the home page.

### Reply Management

- **Add a Reply**:
  - Users can add replies to questions.
  - Character limit for replies: 3000 characters.
  
- **Reply Display**:
  - Replies will show the username of the person who replied.
  - Each reply will display the number of upvotes and downvotes.

- **Sorting of Replies**:
  - To be implemented in a later phase: Sorting replies based on the latest or upvotes.

## Notes

- Character limits for names, usernames, emails, and avatars will be defined in future updates.
- Additional features, such as editing profiles and sorting replies, will be implemented in subsequent development phases.

---

This `README.md` provides an overview of the planned features and development phases for the project.