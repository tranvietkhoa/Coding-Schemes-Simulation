import { useMainPageContext } from "../../pages/context"


export default function PaginationButton({ pageName, order }) {
  const { moveToPage } = useMainPageContext();

  return (
    <button className="btn btn-primary" onClick={() => moveToPage(order)}>{pageName}</button>
  )
}