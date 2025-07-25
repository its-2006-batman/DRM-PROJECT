function updateDateTime() {
  const now = new Date();

  // Get date parts
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
  const month = now.toLocaleDateString('en-US', { month: 'long' });
  const day = now.getDate();
  const year = now.getFullYear();

  // Time
  let hours = now.getHours().toString().padStart(2, '0');
  let minutes = now.getMinutes().toString().padStart(2, '0');
  let seconds = now.getSeconds().toString().padStart(2, '0');

  // Build the string
  const formatted = `${weekday}, ${month} ${day}, ${year} ${hours}:${minutes}:${seconds} IST`;

  document.getElementById('datetime').textContent = formatted;
}

setInterval(updateDateTime, 1000);
updateDateTime()

async function fetchLatestData() {
  try {
    const res = await fetch('/latest');
    const result = await res.json();

    if (!result.success || !result.data) {
      document.getElementById("data-container").innerHTML = "⚠️ No data found.";
      return;
    }

    const data = result.data;
    let html = "";

    for (let key in data) {
      if (['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) continue;
      const value = Array.isArray(data[key]) ? data[key].join("<br>") : data[key];
      html += `<div class="field"><h3>${key}</h3><p>${value}</p></div>`;
    }

    document.getElementById("data-container").innerHTML = html;
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("data-container").innerHTML = "❌ Error loading data.";
  }
}

fetchLatestData();
