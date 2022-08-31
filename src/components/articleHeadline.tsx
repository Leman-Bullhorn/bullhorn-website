import { HeadlineFont } from "./headlineFont";

interface ArticleHeadlineProps {
  children: React.ReactNode;
}

export const ArticleHeadline = (props: ArticleHeadlineProps) => {
  return (
    <HeadlineFont>
      <h1 className="text-center fw-bold">{props.children}</h1>
    </HeadlineFont>
  );
};
