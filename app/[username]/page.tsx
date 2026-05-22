export default function ProfilePage({ params }: { params: { username: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">@{params.username}</h1>
    </div>
  )
}
