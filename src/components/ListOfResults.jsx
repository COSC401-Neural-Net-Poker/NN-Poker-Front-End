import { Link } from 'react-router-dom';

const ListOfResults = ({history = []}) => {
  
  return (
    <div className="flex w-full items-center justify-center h-full flex-col">
        {history.map((game, ind) => {
            return(
              <Link key={ind} className='w-full' to={`/history/${ind}`}>
                <div className="w-full mb-3 text-white flex justify-between items-center h-[30px] bg-slate-500">
                  <h1>{game.result}</h1>
                </div>
              </Link>
            )
        })}
    </div>
  )
}

export default ListOfResults