import { fetchData } from "./api2.mjs";

describe( fetchData, () => {
    it('chamada com sucesso aos dados da api', async () => {
        const mockResponse = {data: 'fake data'};
        jest.spyOn(global, 'Fetch').mockResolvedValue ({
            json: jest.fn().mockResolvedValue(mockResponse)
        });

        const data = await fetchData();

        expect(data).toEqual(mockResponse);
    });

    it ('chamada com erro aos dados da api', async () => {
        const errorMenssage = 'Erro na chamada';
        jest.spyOn(global, 'fetch').mockRejectedValue(new Error(errorMenssage));
    })
});