import { redirect } from 'next/navigation';

const HomePage = (): never => {
  redirect('/notes');
};

export default HomePage;
