import React, { useState } from "react";
import Table from "./table-ui";

export default function ListEvents(props) {
  const [user, setUser] = useState(props.data);

  return <Table data={user} />;
}