import { useGlobalContext } from '../utils/context';
import UserLogo from "../Assests/user.png";

export function StickyNavbar() {

  const { state } = useGlobalContext();
  const { isLoggedIn, role, name, email, _id } = state;
  console.log("id: ", _id);
  console.log("Name:", name);
  console.log("State: ", state);
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="h-20 w-full shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
        </div>
        <div className="lg:flex lg:flex-1 lg:justify-end item-center">
          <div className='flex space-x-4 items-center text-sm font-semibold'>
            <a href="#" className="text-gray-900 no-underline">
              About
            </a>
            <a href="#" className="text-gray-900 no-underline">
              ContactUs
            </a>
            {isLoggedIn ? (
              <div className='flex items-center space-x-2 '>
                <img src={UserLogo} className="userLogo w-7 h-7" alt="User Logo"/>
                <div className='hidden lg:block'>
                  Welcome, {name}
                </div>
              </div>
            ) : (<button className=" p-2 px-3 bg-indigo-600 rounded-lg">
              <a href="/Login" className=" text-white no-underline">
                Login
              </a>
            </button>)}

          </div>
        </div>
      </nav>
    </header>
  )
}

