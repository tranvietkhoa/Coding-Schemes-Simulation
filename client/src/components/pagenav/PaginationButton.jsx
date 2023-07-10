import { useMainPageContext } from "../../pages/context"


export default function PaginationButton({ pageName, order }) {
  const { setCurrPage } = useMainPageContext();

  return (
    <button className="btn btn-primary" onClick={() => setCurrPage(order)}>{pageName}</button>
  )
}