import React from "react";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const Notepage = async ({ params }: Props) => {
  const noteId = (await params).slug;

  return <div>Notepage</div>;
};

export default Notepage;
