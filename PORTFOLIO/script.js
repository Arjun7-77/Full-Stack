document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("project-form");
  const titleInput = document.getElementById("project-title");
  const descInput = document.getElementById("project-description");
  const projectList = document.getElementById("project-list");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const description = descInput.value.trim();

    if (!title || !description) {
      alert("Please fill in both fields.");
      return;
    }

    const newProject = {
      title: title,
      description: description
    };

    // 🔁 Send data using fetch (simulate a backend using JSONPlaceholder)
    try {
      const response = await fetch('/api/items/:id', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newProject)
      });

      const data = await response.json();

      if (response.ok) {
        addProjectToUI(data.title, data.description);
        form.reset(); // clear inputs
      } else {
        alert("Failed to add project.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Error connecting to server.");
    }
  });

  function addProjectToUI(title, description) {
    const card = document.createElement("div");
    card.style.border = "1px solid #444";
    card.style.borderRadius = "6px";
    card.style.margin = "8px 0";
    card.style.padding = "10px";
    card.style.backgroundColor = "#2b2b2b";

    const titleEl = document.createElement("strong");
    titleEl.textContent = title;

    const descEl = document.createElement("p");
    descEl.textContent = description;

    card.appendChild(titleEl);
    card.appendChild(descEl);

    // add on top
    projectList.prepend(card);
  }
});
