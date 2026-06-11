import { Helmet } from 'react-helmet-async';

type Props = {
  title: string;
  description: string;
  canonical?: string;
};

export function PageMeta({ title, description, canonical }: Props) {
  return (
    <Helmet>
      <title>{title} | Affittochiaro</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
}
