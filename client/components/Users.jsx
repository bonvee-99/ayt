import User from "./User"
import styles from "../styles/Home.module.css"

const Users = ({ userList, toggleUser }) => {
  return (
    <div styles={styles.users}>
      <ul styles={styles}>
        {userList.map(u => {
          return <User key={u.id} toggleUser={toggleUser} user={u}/>
        })}
      </ul>
    </div>
  )
}

export default Users
