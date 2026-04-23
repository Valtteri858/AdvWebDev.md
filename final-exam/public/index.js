async function loadCustomers() {
  const container = document.getElementById("customer-list");

  try {
    const res = await fetch("/api/persons");

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    // Clear placeholder
    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = "<p>No customers found.</p>";
      return;
    }

    // Create simple list
    data.forEach(person => {
      const div = document.createElement("div");
      div.className = "customer-card";

      div.innerHTML = `
        <strong>${person.first_name} ${person.last_name}</strong><br>
        Email: ${person.email}<br>
        Phone: ${person.phone || "-"}
      `;

      div.addEventListener("click", () => {
        loadCustomerById(person.id);
      });

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p style='color:red;'>Error loading data</p>";
  }
}

// Run on page load
loadCustomers();

let selectedId = null;


// -------------------------------
// Fill form with customer data
// -------------------------------
function fillForm(person) {
  document.getElementById("first_name").value = person.first_name;
  document.getElementById("last_name").value = person.last_name;
  document.getElementById("email").value = person.email;
  document.getElementById("phone").value = person.phone || "";
  document.getElementById("birth_date").value = person.birth_date || "";

  selectedId = person.id;

  document.getElementById("updateBtn").disabled = false;
  document.getElementById("deleteBtn").disabled = false;
}


// -------------------------------
// Load single customer by ID
// -------------------------------
async function loadCustomerById(id) {
  const res = await fetch(`/api/persons/${id}`);

  if (!res.ok) {
    alert("Failed to load customer");
    return;
  }

  const person = await res.json();
  fillForm(person);
}


// -------------------------------
// ADD customer (POST)
// -------------------------------
document.getElementById("customerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    birth_date: document.getElementById("birth_date").value
  };

  const res = await fetch("/api/persons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.json();
    alert("Error: " + err.error);
    return;
  }

  alert("Customer added!");

  selectedId = null;
  document.getElementById("customerForm").reset();
  document.getElementById("updateBtn").disabled = true;
  document.getElementById("deleteBtn").disabled = true;

  loadCustomers();
});


// -------------------------------
// UPDATE customer (PUT)
// -------------------------------
document.getElementById("updateBtn").addEventListener("click", async () => {
  if (!selectedId) return;

  const data = {
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    birth_date: document.getElementById("birth_date").value
  };

  const res = await fetch(`/api/persons/${selectedId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.json();
    alert("Error: " + err.error);
    return;
  }

  alert("Customer updated!");
  loadCustomers();
});


// -------------------------------
// DELETE customer (DELETE)
// -------------------------------
document.getElementById("deleteBtn").addEventListener("click", async () => {
  if (!selectedId) return;

  if (!confirm("Delete this customer?")) return;

  const res = await fetch(`/api/persons/${selectedId}`, {
    method: "DELETE"
  });

  if (!res.ok) {
    const err = await res.json();
    alert("Error: " + err.error);
    return;
  }

  alert("Customer deleted!");

  selectedId = null;
  document.getElementById("customerForm").reset();
  document.getElementById("updateBtn").disabled = true;
  document.getElementById("deleteBtn").disabled = true;

  loadCustomers();
});