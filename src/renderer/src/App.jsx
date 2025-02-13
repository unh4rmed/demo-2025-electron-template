import { useEffect, useState } from "react"
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";
import logo from './assets/logo.png'

function App() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    familyMembers: [],
    familyMembersJobs: []
  });

  useEffect(() => {
    (async () => {
      const res = await window.api.getData()
      setData(res)
    })()
  }, [])


  const calculateAge = (birthDate) => {
    const currentDate = new Date();
    
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    
    if ((currentDate.getMonth() < birthDate.getMonth()) ||
      (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  const calculate1 = (price_per_unit, quantity, salary) => {
    if (!price_per_unit || !quantity || !salary){
      return 0;
    }
   return salary / (price_per_unit * quantity) 
  }

  const combinedData = data?.familyMembers.map(member => {
    const jobInfo = data?.familyMembersJobs.find(job => job.family_member_id === member.id);
    const productInfo = data?.product.find(el => el.id === member.id);
    const expenceProductInfo = data?.expenceProduct.find(el => el.id === member.id);
    console.log(jobInfo)
    return {
        ...member,
        birth_date: calculateAge(member.birth_date),
        salary_to_expense_ratio: calculate1(productInfo?.price_per_unit, expenceProductInfo?.quantity, jobInfo?.salary),
        ...(jobInfo ? {
            current_position: jobInfo.current_position,
            organization: jobInfo.organization,
            salary:(jobInfo.salary > -100 ? Math.abs(jobInfo.salary):'Не указана')
        }:{})
      }
});

  return (
    <>
      <div className="page-heading">
        <img className="page-logo" src={logo} alt="" />
        <h1>Тест</h1>
      </div>
      <ul className="list">
        {combinedData.map((combinedData) => {
          return <li className="partner-card" key={combinedData.id} >
          <div className="partner-data">
            <p className="card_heading">{combinedData.organization_type || combinedData.name}</p>
            <div className="partner-data-info">
              <p>{combinedData.full_name}</p>
              <p>{combinedData.birth_date}</p>
              <p>{combinedData.current_position || "без работный"}</p>
              <p>{combinedData.organization || '-'}</p>
              <p>{combinedData.salary}</p>
            </div>
          </div>
          <div className="partner-sale partner-data card_heading">
            {combinedData.salary_to_expense_ratio > 0  ? "Профицит бюджета" : "Дефицит бюджета"}
          </div>
        </li>
        })}
      </ul>

      <Link to={'/create'}>
        <button>
          Создать
        </button>
      </Link>
    </>
  )
}

export default App
