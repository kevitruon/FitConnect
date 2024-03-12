import { useToken } from '@galvanize-inc/jwtdown-for-react'

const PrintToken = () => {
    const { getToken } = useToken()

    const printToken = async () => {
        try {
            const token = await getToken()
            console.log('Cookie Token:', token)
        } catch (error) {
            console.error('Error retrieving token:', error)
        }
    }

    return (
        <div>
            <button onClick={printToken}>Print Cookie Token</button>
        </div>
    )
}

export default PrintToken
