function addBreakdownRow(tbody, factor, userValue, impact) {
  var row = document.createElement("tr");
  row.innerHTML =
    "<td>" +
    factor +
    "</td>" +
    "<td>" +
    userValue +
    "</td>" +
    "<td>" +
    impact +
    "</td>";
  tbody.appendChild(row);
}
