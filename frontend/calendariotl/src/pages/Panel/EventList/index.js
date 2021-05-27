import React, { useState } from "react";
import Table from "./table-ui";

export default function ListEvents(props) {
  const [user] = useState(props.data);

  return <Table data={user} />;
}