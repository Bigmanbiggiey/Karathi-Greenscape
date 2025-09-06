import React from "react";
import { Title, Meta } from "react-head";

const SEO = ({ title, description }) => {
  return (
    <>
      <Title>{title}</Title>
      {description && <Meta name="description" content={description} />}
    </>
  );
};

export default SEO;
