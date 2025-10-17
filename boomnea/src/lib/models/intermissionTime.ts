async function sleep(milliseconds: number): Promise<void> 
{
    /* promises handle asynchronous operations. 
    these are processes that run independently
    from other processes.

    the function setTimeout() sets a timer which
    executes a piece of code once expired. we 
    pass the parameter milliseconds to specify
    for how long we are (asynchronously) sleeping
    */
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
} 

export async function intermissionTime() {
    let intermissionTime = 15;

    while (intermissionTime > 0)
    {
        await sleep(1000);
        intermissionTime--;
    }
    // await queries("...");

}