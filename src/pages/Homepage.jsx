import { Link } from "react-router-dom"
import PageNavigation from "../components/PageNavigation"

function Homepage() {
    return (
        <div>
            <PageNavigation />
            <h1 className="test">WorldWise</h1>
            <Link to="/app">Go to app</Link>
        </div>
    )
}

export default Homepage
