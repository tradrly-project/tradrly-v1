import { Card, CardHeader, CardTitle } from '../ui/card'

export const PsychologySettingsForm = () => {
  return (
      <div className="w-[50%]">
          <Card className="bg-background shadow-md rounded-2xl">
              <CardHeader>
                  <CardTitle className="text-foreground text-lg font-semibold tracking-tight">Pengaturan Psikologi</CardTitle>
              </CardHeader>
          </Card>
      </div>
  )
}
