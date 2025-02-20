import Head from "next/head";

export default function HeadTitle({ children }: { children: React.ReactNode }) {
  return (
    <Head>
      <title>{children}</title>
    </Head>
  );
}
