import HomeBook from "@/components/book/HomeBook";
import PhoneHome from "@/components/phone/PhoneHome";

export default function Home() {
  return <HomeBook phone={<PhoneHome />} />;
}
